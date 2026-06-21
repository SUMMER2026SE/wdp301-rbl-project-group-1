"""
interaction_handler.py — Handles tutor interaction events published by NestJS.

Interaction type → pre-computed weight:
    VIEW_PROFILE       → 0.05   (low intent)
    BID_ACCEPTED       → 0.20   (moderate intent)
    RATING             → 0.30   (explicit feedback)
    BOOKING_CREATED    → 0.40   (strong intent)
    BOOKING_COMPLETED  → 0.50   (strongest — completed engagement)
"""
from __future__ import annotations
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm.attributes import flag_modified

from src.handlers.base import BaseEventHandler
from src.models.interaction import TutorInteraction
from src.models.user import User
from src.models.tutor_item import TutorItem
from src.config.db import get_session_maker
from src.jobs.embedding_queue import push_to_embedding_queue


# Pre-computed weights (mirrored in TutorInteraction model docstring)
INTERACTION_WEIGHTS: dict[str, float] = {
    "VIEW_PROFILE":      0.05,
    "BID_ACCEPTED":      0.20,
    "RATING":            0.30,
    "BOOKING_CREATED":   0.40,
    "BOOKING_COMPLETED": 0.50,
}


class InteractionLoggedHandler(BaseEventHandler):
    """
    Handles VIEW_PROFILE and BID_ACCEPTED generic interaction events.

    Expected payload (NestJS INTERACTION_LOGGED event):
        {
          "userId":          "student_id",
          "tutorId":         "tutor_id",
          "interactionType": "VIEW_PROFILE" | "BID_ACCEPTED",
          "context":         {"deviceType": "mobile"}
        }
    """

    async def handle(self, payload: dict[str, Any]) -> None:
        interaction_type = payload.get("interactionType", "VIEW_PROFILE")
        weight = INTERACTION_WEIGHTS.get(interaction_type, 0.05)

        await _save_interaction_and_update_user(
            user_id=payload.get("userId"),
            tutor_id=payload.get("tutorId"),
            interaction_type=interaction_type,
            weight=weight,
            context=payload.get("context"),
            update_tutor_vector=(interaction_type in {"BID_ACCEPTED"}),
        )


class BookingCreatedHandler(BaseEventHandler):
    """
    Handles BOOKING_CREATED events — high-weight signal (0.40).
    Also increments TutorItem.metrics.bookingCount.

    Expected payload (NestJS BOOKING_CREATED event):
        {
          "userId":      "student_id",
          "tutorId":     "tutor_id",
          "bookingId":   "booking_id",
          "subjectSlug": "toan",
          "gradeSlug":   "lop-11"
        }
    """

    async def handle(self, payload: dict[str, Any]) -> None:
        await _save_interaction_and_update_user(
            user_id=payload.get("userId"),
            tutor_id=payload.get("tutorId"),
            interaction_type="BOOKING_CREATED",
            weight=INTERACTION_WEIGHTS["BOOKING_CREATED"],
            context={
                "bookingId":   payload.get("bookingId"),
                "subjectSlug": payload.get("subjectSlug"),
                "gradeSlug":   payload.get("gradeSlug"),
            },
            update_tutor_vector=True,
        )

        # Increment bookingCount in TutorItem metrics
        await _increment_tutor_metric(payload.get("tutorId"), "bookingCount")


class BookingCompletedHandler(BaseEventHandler):
    """
    Handles BOOKING_COMPLETED events — strongest signal (0.50).
    Triggers user embedding refresh to shift vector toward this tutor.

    Expected payload (NestJS BOOKING_COMPLETED event):
        {
          "userId":    "student_id",
          "tutorId":   "tutor_id",
          "bookingId": "booking_id"
        }
    """

    async def handle(self, payload: dict[str, Any]) -> None:
        await _save_interaction_and_update_user(
            user_id=payload.get("userId"),
            tutor_id=payload.get("tutorId"),
            interaction_type="BOOKING_COMPLETED",
            weight=INTERACTION_WEIGHTS["BOOKING_COMPLETED"],
            context={"bookingId": payload.get("bookingId")},
            update_tutor_vector=True,
        )

        # Refresh user embedding after strong positive signal
        await push_to_embedding_queue({"type": "USER", "id": payload.get("userId")})


class ReviewCreatedHandler(BaseEventHandler):
    """
    Handles REVIEW_CREATED events.
    Computes weight dynamically based on rating: (rating - 3) * 0.15.
    Rating 5 -> 0.30, Rating 4 -> 0.15, Rating 3 -> 0.0, Rating 2 -> -0.15, Rating 1 -> -0.30.

    Expected payload (NestJS REVIEW_CREATED event):
        {
          "reviewId":  "review_id",
          "bookingId": "booking_id",
          "tutorId":   "tutor_id",
          "studentId": "student_id",
          "rating":    5
        }
    """

    async def handle(self, payload: dict[str, Any]) -> None:
        rating = float(payload.get("rating", 3.0))
        weight = (rating - 3.0) * 0.15

        await _save_interaction_and_update_user(
            user_id=payload.get("studentId"),
            tutor_id=payload.get("tutorId"),
            interaction_type="RATING",
            weight=weight,
            context={
                "reviewId": payload.get("reviewId"),
                "bookingId": payload.get("bookingId"),
                "rating": rating,
            },
            update_tutor_vector=True,
        )

        # Refresh user embedding after explicit feedback
        await push_to_embedding_queue({"type": "USER", "id": payload.get("studentId")})


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

async def _save_interaction_and_update_user(
    user_id: str | None,
    tutor_id: str | None,
    interaction_type: str,
    weight: float,
    context: dict | None,
    update_tutor_vector: bool = False,
) -> None:
    """
    Persists a TutorInteraction row and:
    1. Updates User.recommendation.implicitPreferences with this tutor_id.
    2. Applies online vector shift if tutor has an embedding (Exponential Moving Average).
    """
    if not user_id or not tutor_id:
        print(f"[!] [InteractionHandler] Missing userId or tutorId — skipping.")
        return

    async_session = get_session_maker()
    async with async_session() as session:
        # Persist interaction
        interaction = TutorInteraction(
            user_id=user_id,
            tutor_id=tutor_id,
            type=interaction_type,
            value=weight,
            context=context or {},
        )
        session.add(interaction)
        await session.flush()

        # Load user and tutor concurrently-ish via sequential queries (same session)
        user_res = await session.execute(select(User).filter_by(id=user_id))
        user = user_res.scalar_one_or_none()

        if user:
            rec = dict(user.recommendation or {})
            implicit = rec.setdefault("implicitPreferences", {
                "viewedTutorIds": [],
                "bookedTutorIds": [],
            })

            # Maintain history lists (deduped, most recent appended)
            if interaction_type == "VIEW_PROFILE":
                viewed = implicit.setdefault("viewedTutorIds", [])
                if tutor_id not in viewed:
                    viewed.append(tutor_id)
                implicit["viewedTutorIds"] = viewed[-50:]   # keep last 50

            elif interaction_type in {"BOOKING_CREATED", "BOOKING_COMPLETED"}:
                booked = implicit.setdefault("bookedTutorIds", [])
                if tutor_id not in booked:
                    booked.append(tutor_id)
                implicit["bookedTutorIds"] = booked

            # Online embedding update: EMA shift toward tutor vector
            if update_tutor_vector:
                tutor_res = await session.execute(select(TutorItem).filter_by(id=tutor_id))
                tutor = tutor_res.scalar_one_or_none()

                if tutor and tutor.embedding_vector is not None:
                    alpha = weight * 0.3   # scale alpha by interaction weight
                    user_vector = rec.get("embeddingVector", [])
                    tutor_vector = list(tutor.embedding_vector)

                    if not user_vector or len(user_vector) != len(tutor_vector):
                        # Cold-start: assign tutor vector directly
                        rec["embeddingVector"] = tutor_vector
                        print(f"[*] User {user_id} vector initialized from Tutor {tutor_id}.")
                    else:
                        new_vector = [
                            (1 - alpha) * u + alpha * t
                            for u, t in zip(user_vector, tutor_vector)
                        ]
                        rec["embeddingVector"] = new_vector
                        print(f"[*] User {user_id} vector shifted toward Tutor {tutor_id} (α={alpha:.2f}).")

            user.recommendation = rec
            flag_modified(user, "recommendation")

        await session.commit()
        print(f"[*] [{interaction_type}] Saved: User {user_id} → Tutor {tutor_id} (weight={weight}).")


async def _increment_tutor_metric(tutor_id: str | None, metric: str) -> None:
    """Increment a numeric metric inside TutorItem.metrics JSONB."""
    if not tutor_id:
        return

    async_session = get_session_maker()
    async with async_session() as session:
        result = await session.execute(select(TutorItem).filter_by(id=tutor_id))
        tutor = result.scalar_one_or_none()
        if tutor:
            metrics = dict(tutor.metrics or {})
            metrics[metric] = metrics.get(metric, 0) + 1
            tutor.metrics = metrics
            flag_modified(tutor, "metrics")
            await session.commit()
            print(f"[*] TutorItem {tutor_id} {metric} → {metrics[metric]}.")
