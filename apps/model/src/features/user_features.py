"""
user_features.py
Feature extraction utilities for student (user) context in the recommendation pipeline.
"""
from __future__ import annotations
from src.features.schedule_scorer import Slot, parse_slots


# ---------------------------------------------------------------------------
# Student context extraction
# ---------------------------------------------------------------------------

def get_explicit_preferences(recommendation: dict | None) -> tuple[list[str], list[str]]:
    """
    Extract the student's explicit subject and grade preferences from
    the User.recommendation JSONB field.

    Returns:
        (subject_slugs, grade_slugs)  — both may be empty lists
    """
    if not recommendation:
        return [], []

    explicit = recommendation.get("explicitPreferences", {})
    subjects = explicit.get("subjectSlugs", [])
    grades = explicit.get("gradeSlugs", [])
    return list(subjects), list(grades)


def get_implicit_preferences(recommendation: dict | None) -> tuple[list[str], list[str]]:
    """
    Extract the student's implicit tutor engagement history from
    the User.recommendation JSONB field.

    Returns:
        (viewed_tutor_ids, booked_tutor_ids)
    """
    if not recommendation:
        return [], []

    implicit = recommendation.get("implicitPreferences", {})
    viewed = implicit.get("viewedTutorIds", [])
    booked = implicit.get("bookedTutorIds", [])
    return list(viewed), list(booked)


def get_user_embedding_vector(recommendation: dict | None) -> list[float] | None:
    """
    Extract the user's precomputed embedding vector from recommendation JSONB.
    Returns None if vector is absent or empty (triggers cold-start path).
    """
    if not recommendation:
        return None
    vector = recommendation.get("embeddingVector", [])
    return list(vector) if vector else None


def get_user_slots_from_db_rows(availability_rows: list) -> set[Slot]:
    """
    Convert SQLAlchemy UserAvailability ORM rows to a set of Slot tuples.

    Args:
        availability_rows: list of UserAvailability ORM objects
    Returns:
        set of (dayOfWeek, startTime, endTime) tuples
    """
    slots: set[Slot] = set()
    for row in availability_rows:
        try:
            slots.add((row.day_of_week, row.start_time, row.end_time))
        except AttributeError:
            continue
    return slots


def get_user_slots_from_dicts(availability_list: list[dict]) -> set[Slot]:
    """
    Convert raw availability dicts (e.g., from JSONB payload) to Slot set.
    Delegates to schedule_scorer.parse_slots.
    """
    return parse_slots(availability_list)


# ---------------------------------------------------------------------------
# Interaction score computation
# ---------------------------------------------------------------------------

def compute_interaction_score(
    tutor_id: str,
    interaction_rows: list,
) -> float:
    """
    Compute a weighted interaction score for a specific tutor based on
    the student's historical interactions.

    Weights (mirrors TutorInteraction.INTERACTION_WEIGHTS):
        VIEW_PROFILE       → 0.05
        BID_ACCEPTED       → 0.20
        BOOKING_CREATED    → 0.40
        BOOKING_COMPLETED  → 0.50
        RATING             → 0.30

    The raw score is capped at 1.0 via tanh-like normalization.

    Args:
        tutor_id:         the tutor being scored
        interaction_rows: list of TutorInteraction ORM objects for this student
    Returns:
        float in [0.0, 1.0]
    """
    import math

    raw_score = 0.0
    for row in interaction_rows:
        if row.tutor_id == tutor_id:
            raw_score += row.value

    # Normalize: tanh scales any positive raw score to (0, 1)
    return math.tanh(raw_score)
