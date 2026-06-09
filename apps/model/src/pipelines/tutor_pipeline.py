"""
tutor_pipeline.py
4-signal Tutor Recommendation Pipeline.

Signal weights (sum = 1.0):
    semantic_score      0.30   pgvector cosine similarity (user ↔ tutor embedding)
    subject_match_score 0.25   Jaccard overlap of subjects & grades
    interaction_score   0.25   weighted history (booking/view/rating)
    schedule_score      0.15   availability slot overlap (Jaccard)
    quality_score       0.05   normalized rating × review count
"""
from __future__ import annotations
import math
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.models.user import User
from src.models.tutor_item import TutorItem
from src.models.user_availability import UserAvailability
from src.models.interaction import TutorInteraction
from src.features.tutor_features import (
    score_subject_grade_combined,
    has_subject_overlap,
)
from src.features.user_features import (
    get_explicit_preferences,
    get_implicit_preferences,
    get_user_embedding_vector,
    get_user_slots_from_db_rows,
    compute_interaction_score,
)
from src.features.schedule_scorer import parse_slots, combined_schedule_score
from src.ranking.ranker import rank_candidates
from src.config.db import get_session_maker


# ---------------------------------------------------------------------------
# Pipeline weights (tunable via env/config)
# ---------------------------------------------------------------------------
WEIGHTS = {
    "semantic":       0.30,
    "subject_match":  0.25,
    "interaction":    0.25,
    "schedule":       0.15,
    "quality":        0.05,
}

# Minimum subject overlap required to include a candidate at all
REQUIRE_SUBJECT_OVERLAP: bool = True

# How many candidates to pull per sub-strategy before final re-rank
CANDIDATE_POOL_MULTIPLIER: int = 5


# ---------------------------------------------------------------------------
# Public entry-point
# ---------------------------------------------------------------------------

async def recommend_tutors(
    user_id: str,
    top_k: int = 10,
    subject_slug: str | None = None,
    grade_slug: str | None = None,
) -> dict[str, Any]:
    """
    Generate ranked tutor recommendations for a student.

    Args:
        user_id:      the requesting student's user ID
        top_k:        number of recommendations to return
        subject_slug: optional hard-filter on a specific subject
        grade_slug:   optional hard-filter on a specific grade

    Returns:
        {
          "tutor_ids": ["t1", "t2", ...],
          "scores": {
              "t1": {
                  "total":        0.83,
                  "semantic":     0.90,
                  "subject_match":0.75,
                  "interaction":  0.60,
                  "schedule":     0.50,
                  "quality":      0.40
              },
              ...
          },
          "strategy": "multi_signal" | "cold_start",
          "cold_start": false
        }
    """
    async_session = get_session_maker()
    async with async_session() as session:

        # ── 1. Load student context ──────────────────────────────────────────
        user_res = await session.execute(select(User).filter_by(id=user_id))
        user = user_res.scalar_one_or_none()

        student_subjects, student_grades = get_explicit_preferences(
            user.recommendation if user else None
        )
        _, booked_tutor_ids = get_implicit_preferences(
            user.recommendation if user else None
        )
        user_vector = get_user_embedding_vector(
            user.recommendation if user else None
        )

        # Apply optional override filters from query params
        if subject_slug and subject_slug not in student_subjects:
            student_subjects = [subject_slug]
        if grade_slug and grade_slug not in student_grades:
            student_grades = [grade_slug]

        # Load student availability slots
        avail_res = await session.execute(
            select(UserAvailability).filter_by(user_id=user_id)
        )
        student_slots = get_user_slots_from_db_rows(avail_res.scalars().all())

        # Load student interaction history with all tutors
        interactions_res = await session.execute(
            select(TutorInteraction).filter_by(user_id=user_id)
        )
        interaction_rows = interactions_res.scalars().all()

        # ── 2. Candidate Generation ───────────────────────────────────────────
        candidate_ids: set[str] = set()
        pool_size = top_k * CANDIDATE_POOL_MULTIPLIER

        # 2a. Vector similarity (semantic) — if user has embedding
        if user_vector:
            vector_stmt = (
                select(TutorItem.id)
                .filter(TutorItem.embedding_vector.is_not(None))
                .order_by(TutorItem.embedding_vector.cosine_distance(user_vector))
                .limit(pool_size)
            )
            vector_res = await session.execute(vector_stmt)
            candidate_ids |= set(vector_res.scalars().all())

        # 2b. Subject/Grade filter (always run — ensures relevant candidates)
        if student_subjects:
            all_tutors_res = await session.execute(
                select(TutorItem.id, TutorItem.features)
            )
            all_tutors = all_tutors_res.all()
            for row_id, features in all_tutors:
                if has_subject_overlap(student_subjects, features.get("subjectSlugs", [])):
                    candidate_ids.add(row_id)
                    if len(candidate_ids) >= pool_size * 2:
                        break

        # 2c. Collaborative: inject tutors booked by this student (re-book signal)
        for booked_id in booked_tutor_ids:
            candidate_ids.add(booked_id)

        # ── 3. Cold Start Fallback ────────────────────────────────────────────
        if not candidate_ids:
            print(f"[*] [TutorPipeline] No candidates for {user_id} — using cold start.")
            return await _cold_start(session, student_subjects, top_k)

        # ── 4. Load full TutorItem data for scoring ───────────────────────────
        tutor_res = await session.execute(
            select(TutorItem).filter(TutorItem.id.in_(candidate_ids))
        )
        tutors = tutor_res.scalars().all()

        # ── 5. Multi-Signal Scoring ───────────────────────────────────────────
        scored: list[dict] = []
        for tutor in tutors:
            features = tutor.features or {}
            metrics  = tutor.metrics  or {}

            # Hard filter: skip tutor if REQUIRE_SUBJECT_OVERLAP and no match
            if REQUIRE_SUBJECT_OVERLAP and student_subjects:
                if not has_subject_overlap(
                    student_subjects, features.get("subjectSlugs", [])
                ):
                    continue

            # Signal 1: Semantic (vector cosine similarity → convert distance to score)
            semantic = 0.0
            if user_vector and tutor.embedding_vector is not None:
                tutor_vec = list(tutor.embedding_vector)
                dot = sum(u * t for u, t in zip(user_vector, tutor_vec))
                semantic = max(0.0, min(1.0, (1.0 + dot) / 2.0))   # cosine [-1,1] → [0,1]

            # Signal 2: Subject + Grade match
            subject_match = score_subject_grade_combined(
                student_subjects=student_subjects,
                student_grades=student_grades,
                tutor_subject_slugs=features.get("subjectSlugs", []),
                tutor_grade_slugs=features.get("gradeSlugs", []),
            )

            # Signal 3: Interaction history
            interaction = compute_interaction_score(tutor.id, interaction_rows)

            # Signal 4: Schedule overlap (use cached slots in JSONB features)
            tutor_slots = parse_slots(features.get("availabilitySlots", []))
            schedule = combined_schedule_score(student_slots, tutor_slots)

            # Signal 5: Quality (normalized rating × log(reviewCount+1))
            rating       = float(metrics.get("rating", 0.0))
            review_count = int(metrics.get("reviewCount", 0))
            quality      = (rating / 5.0) * math.log1p(review_count) / math.log1p(100)

            # Weighted total
            total = (
                WEIGHTS["semantic"]      * semantic
                + WEIGHTS["subject_match"] * subject_match
                + WEIGHTS["interaction"]   * interaction
                + WEIGHTS["schedule"]      * schedule
                + WEIGHTS["quality"]       * quality
            )

            scored.append({
                "tutor_id":     tutor.id,
                "total":        float(round(total, 4)),
                "semantic":     float(round(semantic, 4)),
                "subject_match":float(round(subject_match, 4)),
                "interaction":  float(round(interaction, 4)),
                "schedule":     float(round(schedule, 4)),
                "quality":      float(round(quality, 4)),
            })

        if not scored:
            return await _cold_start(session, student_subjects, top_k)

        # ── 6. Rank & slice top_k ─────────────────────────────────────────────
        ranked = sorted(scored, key=lambda x: x["total"], reverse=True)[:top_k]

        tutor_ids = [r["tutor_id"] for r in ranked]
        score_map = {r["tutor_id"]: r for r in ranked}

        print(
            f"[*] [TutorPipeline] Recommended {len(tutor_ids)} tutors for User {user_id} "
            f"(strategy=multi_signal, candidates={len(candidate_ids)})."
        )
        return {
            "tutor_ids":  tutor_ids,
            "scores":     score_map,
            "strategy":   "multi_signal",
            "cold_start": False,
        }


# ---------------------------------------------------------------------------
# Cold-start fallback
# ---------------------------------------------------------------------------

async def _cold_start(session, subject_slugs: list[str], top_k: int) -> dict[str, Any]:
    """
    Return top-rated tutors that teach any of the student's subjects.
    Falls back to globally top-rated tutors if no subjects are set.
    """
    stmt = select(TutorItem.id, TutorItem.features, TutorItem.metrics)

    result = await session.execute(stmt)
    rows = result.all()

    # Filter by subject if available
    filtered = [
        (row_id, features, metrics)
        for row_id, features, metrics in rows
        if not subject_slugs
           or has_subject_overlap(subject_slugs, (features or {}).get("subjectSlugs", []))
    ]

    if not filtered:
        filtered = rows  # absolute fallback: no filter

    # Sort by rating desc, reviewCount desc
    filtered.sort(
        key=lambda r: (
            -(r[2] or {}).get("rating", 0),
            -(r[2] or {}).get("reviewCount", 0),
        )
    )

    tutor_ids = [r[0] for r in filtered[:top_k]]

    print(
        f"[*] [TutorPipeline] Cold-start returned {len(tutor_ids)} tutors "
        f"(subjects={subject_slugs})."
    )
    return {
        "tutor_ids":  tutor_ids,
        "scores":     {},
        "strategy":   "cold_start",
        "cold_start": True,
    }