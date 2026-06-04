"""
user_handler.py — Handles user and tutor lifecycle events published by NestJS.
"""
from __future__ import annotations
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm.attributes import flag_modified

from src.handlers.base import BaseEventHandler
from src.models.user import User
from src.models.tutor_item import TutorItem
from src.jobs.embedding_queue import push_to_embedding_queue
from src.config.db import get_session_maker


class UserCreatedHandler(BaseEventHandler):
    """
    Initializes the AI recommendation payload when a new student registers.

    Expected payload (NestJS USER_CREATED event):
        {
          "id":           "cuid...",
          "subjectSlugs": ["toan", "ly"],
          "gradeSlugs":   ["lop-11"]
        }
    """

    async def handle(self, payload: dict[str, Any]) -> None:
        async_session = get_session_maker()
        async with async_session() as session:
            result = await session.execute(select(User).filter_by(id=payload.get("id")))
            user = result.scalar_one_or_none()

            if not user:
                print(
                    f"[!] [UserCreatedHandler] User {payload.get('id')} not in DB — "
                    "Backend must INSERT before publishing this event."
                )
                return

            if not user.recommendation:
                user.recommendation = {
                    "explicitPreferences": {
                        "subjectSlugs": payload.get("subjectSlugs", []),
                        "gradeSlugs":   payload.get("gradeSlugs", []),
                    },
                    "implicitPreferences": {
                        "viewedTutorIds":  [],
                        "bookedTutorIds":  [],
                    },
                    "embeddingVector": [],
                }
            else:
                rec = dict(user.recommendation)
                if "explicitPreferences" not in rec:
                    rec["explicitPreferences"] = {}
                rec["explicitPreferences"]["subjectSlugs"] = payload.get("subjectSlugs", rec["explicitPreferences"].get("subjectSlugs", []))
                rec["explicitPreferences"]["gradeSlugs"] = payload.get("gradeSlugs", rec["explicitPreferences"].get("gradeSlugs", []))
                user.recommendation = rec

            flag_modified(user, "recommendation")
            await session.commit()
            print(f"[*] [UserCreatedHandler] Recommendation payload initialized for User {user.id}.")

        # Schedule vector generation if user has explicit preferences
        if payload.get("subjectSlugs") or payload.get("gradeSlugs"):
            await push_to_embedding_queue({"type": "USER", "id": payload.get("id")})


class TutorCreatedHandler(BaseEventHandler):
    """
    Upserts a TutorItem document when a tutor application is approved.
    Caches subjectSlugs, gradeSlugs, and availabilitySlots in JSONB features
    to avoid real-time joins during recommendation scoring.

    Expected payload (NestJS TUTOR_CREATED event):
        {
          "id":               "tutor_user_id",
          "name":             "Nguyễn Văn A",
          "avatarUrl":        "https://...",
          "specialization":   "Toán đại số",
          "experience":       3,
          "pricePerHour":     150000,
          "subjectSlugs":     ["toan", "ly"],
          "gradeSlugs":       ["lop-10", "lop-11"],
          "availabilitySlots": [
            {"dayOfWeek": 2, "startTime": "08:00", "endTime": "10:00"}
          ],
          "rating":           0.0,
          "reviewCount":      0,
          "studentCount":     0
        }
    """

    async def handle(self, payload: dict[str, Any]) -> None:
        async_session = get_session_maker()
        async with async_session() as session:
            tutor = TutorItem(
                id=payload.get("id"),
                basic_info={
                    "name":      payload.get("name", "Unknown Tutor"),
                    "avatarUrl": payload.get("avatarUrl"),
                },
                features={
                    "subjectSlugs":      payload.get("subjectSlugs", []),
                    "gradeSlugs":        payload.get("gradeSlugs", []),
                    "specialization":    payload.get("specialization"),
                    "experience":        payload.get("experience", 0),
                    "pricePerHour":      payload.get("pricePerHour", 0),
                    "availabilitySlots": payload.get("availabilitySlots", []),
                },
                metrics={
                    "rating":       payload.get("rating", 0.0),
                    "reviewCount":  payload.get("reviewCount", 0),
                    "studentCount": payload.get("studentCount", 0),
                    "bookingCount": 0,
                },
            )
            session.add(tutor)
            await session.commit()
            print(f"[*] [TutorCreatedHandler] TutorItem {tutor.id} saved.")

        # Trigger embedding generation immediately after creation
        await push_to_embedding_queue({"type": "TUTOR", "id": payload.get("id")})


class TutorUpdatedHandler(BaseEventHandler):
    """
    Updates an existing TutorItem when the tutor's profile, subjects, grades,
    or availability changes. Re-triggers embedding if semantic fields changed.

    Expected payload (NestJS TUTOR_UPDATED event):
        Same shape as TUTOR_CREATED — all fields optional except "id".
    """

    async def handle(self, payload: dict[str, Any]) -> None:
        async_session = get_session_maker()
        async with async_session() as session:
            result = await session.execute(
                select(TutorItem).filter_by(id=payload.get("id"))
            )
            tutor = result.scalar_one_or_none()

            if not tutor:
                print(f"[*] [TutorUpdatedHandler] TutorItem {payload.get('id')} not found — UPSERTING.")
                tutor = TutorItem(
                    id=payload.get("id"),
                    basic_info={"name": "Unknown Tutor"},
                    features={},
                    metrics={"rating": 0.0, "reviewCount": 0, "studentCount": 0, "bookingCount": 0},
                )
                session.add(tutor)

            # Track whether semantic content changed (to decide on re-embedding)
            semantic_changed = False

            # Update basicInfo
            basic = dict(tutor.basic_info or {})
            if "name" in payload:
                basic["name"] = payload["name"]
                semantic_changed = True
            if "avatarUrl" in payload:
                basic["avatarUrl"] = payload["avatarUrl"]
            tutor.basic_info = basic
            flag_modified(tutor, "basic_info")

            # Update features
            features = dict(tutor.features or {})
            for field in ("subjectSlugs", "gradeSlugs", "specialization"):
                if field in payload:
                    features[field] = payload[field]
                    semantic_changed = True
            for field in ("experience", "pricePerHour"):
                if field in payload:
                    features[field] = payload[field]
            if "availabilitySlots" in payload:
                features["availabilitySlots"] = payload["availabilitySlots"]
            tutor.features = features
            flag_modified(tutor, "features")

            # Update metrics (rating/review may come from booking-complete events)
            metrics = dict(tutor.metrics or {})
            for field in ("rating", "reviewCount", "studentCount", "bookingCount"):
                if field in payload:
                    metrics[field] = payload[field]
            tutor.metrics = metrics
            flag_modified(tutor, "metrics")

            await session.commit()
            print(f"[*] [TutorUpdatedHandler] TutorItem {tutor.id} updated.")

        # Re-generate embedding if semantic content changed
        if semantic_changed:
            await push_to_embedding_queue({"type": "TUTOR", "id": payload.get("id")})
