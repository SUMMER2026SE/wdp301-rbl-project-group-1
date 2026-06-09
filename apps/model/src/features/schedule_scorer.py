"""
schedule_scorer.py
Computes schedule overlap score between student and tutor availability.
Score is Jaccard-inspired: ranges 0.0 (no overlap) → 1.0 (full overlap).
"""
from __future__ import annotations

# A slot is represented as (dayOfWeek: int, startTime: str, endTime: str)
# e.g., (1, "08:00", "10:00")  →  Monday 08:00–10:00
Slot = tuple[int, str, str]


def parse_slots(availability_list: list[dict]) -> set[Slot]:
    """
    Convert a list of availability dicts to a set of (dayOfWeek, startTime, endTime) tuples.

    Args:
        availability_list: list of dicts with keys dayOfWeek, startTime, endTime
    Returns:
        set of Slot tuples (deduped)
    """
    slots: set[Slot] = set()
    for slot in availability_list:
        try:
            slots.add((
                int(slot["dayOfWeek"]),
                str(slot["startTime"]),
                str(slot["endTime"]),
            ))
        except (KeyError, TypeError, ValueError):
            continue
    return slots


def compute_schedule_overlap_score(
    student_slots: set[Slot],
    tutor_slots: set[Slot],
) -> float:
    """
    Compute schedule compatibility score between student and tutor.

    Strategy:
        - Exact slot intersection / union  (Jaccard similarity)
        - If student has no availability set → return 0.5 (neutral, unknown)
        - If tutor has no availability set  → return 0.0 (cannot teach)

    Args:
        student_slots: set of (dayOfWeek, startTime, endTime) for student
        tutor_slots:   set of (dayOfWeek, startTime, endTime) for tutor
    Returns:
        float in [0.0, 1.0]
    """
    if not student_slots:
        # Student has not configured availability → neutral score
        return 0.5

    if not tutor_slots:
        # Tutor has no available slots → incompatible
        return 0.0

    intersection = student_slots & tutor_slots
    union = student_slots | tutor_slots

    if not union:
        return 0.0

    return len(intersection) / len(union)


def compute_day_overlap_score(
    student_slots: set[Slot],
    tutor_slots: set[Slot],
) -> float:
    """
    Softer version: only checks day-of-week overlap (ignores exact time).
    Used as a fallback when slot granularity is too strict.

    Args:
        student_slots: set of slots for student
        tutor_slots:   set of slots for tutor
    Returns:
        float in [0.0, 1.0]
    """
    if not student_slots:
        return 0.5
    if not tutor_slots:
        return 0.0

    student_days = {s[0] for s in student_slots}
    tutor_days = {s[0] for s in tutor_slots}

    intersection = student_days & tutor_days
    union = student_days | tutor_days

    return len(intersection) / len(union) if union else 0.0


def combined_schedule_score(
    student_slots: set[Slot],
    tutor_slots: set[Slot],
    exact_weight: float = 0.6,
    day_weight: float = 0.4,
) -> float:
    """
    Weighted blend of exact slot Jaccard and day-of-week Jaccard.
    Provides more lenient scoring for tutors with partial time overlap.

    Returns:
        float in [0.0, 1.0]
    """
    exact = compute_schedule_overlap_score(student_slots, tutor_slots)
    day = compute_day_overlap_score(student_slots, tutor_slots)
    return exact_weight * exact + day_weight * day
