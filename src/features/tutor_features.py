"""
tutor_features.py
Feature engineering utilities for the Tutor recommendation pipeline.
"""
from __future__ import annotations


# ---------------------------------------------------------------------------
# Text generation for embedding
# ---------------------------------------------------------------------------

def build_tutor_feature_text(basic_info: dict, features: dict) -> str:
    """
    Build a rich semantic text string from a TutorItem's JSONB fields.
    This text is encoded by intfloat/multilingual-e5-small into a 384-dim vector.

    Example output:
        "Gia sư: Nguyễn Văn A. Chuyên môn: Toán Đại số. Môn học: toan ly.
         Lớp dạy: lop-10 lop-11. Kinh nghiệm: 3 năm."
    """
    name = basic_info.get("name", "")
    specialization = features.get("specialization", "")
    subjects = " ".join(features.get("subjectSlugs", []))
    grades = " ".join(features.get("gradeSlugs", []))
    experience = features.get("experience", 0)

    parts = [f"Gia sư: {name}."] if name else []
    if specialization:
        parts.append(f"Chuyên môn: {specialization}.")
    if subjects:
        parts.append(f"Môn học: {subjects}.")
    if grades:
        parts.append(f"Lớp dạy: {grades}.")
    if experience:
        parts.append(f"Kinh nghiệm: {experience} năm.")

    return " ".join(parts) if parts else "Gia sư chưa có thông tin."


def build_user_embedding_text(subject_slugs: list[str], grade_slugs: list[str]) -> str:
    """
    Build semantic text for a student's embedding based on explicit preferences.

    Example:
        "Học sinh cần học môn: toan ly. Lớp: lop-11."
    """
    subjects = " ".join(subject_slugs) if subject_slugs else ""
    grades = " ".join(grade_slugs) if grade_slugs else ""

    parts: list[str] = []
    if subjects:
        parts.append(f"Học sinh cần học môn: {subjects}.")
    if grades:
        parts.append(f"Lớp: {grades}.")

    return " ".join(parts) if parts else ""


# ---------------------------------------------------------------------------
# Subject / Grade match scoring
# ---------------------------------------------------------------------------

def score_subject_match(
    student_subjects: list[str],
    tutor_subject_slugs: list[str],
) -> float:
    """
    Jaccard similarity between student required subjects and tutor's subjects.

    Returns:
        float in [0.0, 1.0].  0.0 = no match, 1.0 = perfect match.
    """
    if not student_subjects or not tutor_subject_slugs:
        return 0.0

    s_set = set(student_subjects)
    t_set = set(tutor_subject_slugs)
    intersection = s_set & t_set
    union = s_set | t_set

    return len(intersection) / len(union) if union else 0.0


def score_grade_match(
    student_grades: list[str],
    tutor_grade_slugs: list[str],
) -> float:
    """
    Jaccard similarity between student's grade(s) and tutor's supported grades.

    Returns:
        float in [0.0, 1.0].
    """
    if not student_grades or not tutor_grade_slugs:
        return 0.0

    s_set = set(student_grades)
    t_set = set(tutor_grade_slugs)
    intersection = s_set & t_set
    union = s_set | t_set

    return len(intersection) / len(union) if union else 0.0


def score_subject_grade_combined(
    student_subjects: list[str],
    student_grades: list[str],
    tutor_subject_slugs: list[str],
    tutor_grade_slugs: list[str],
    subject_weight: float = 0.65,
    grade_weight: float = 0.35,
) -> float:
    """
    Weighted combination of subject and grade match scores.

    Args:
        subject_weight: importance of subject overlap (default 65%)
        grade_weight:   importance of grade overlap (default 35%)
    Returns:
        float in [0.0, 1.0]
    """
    subject_score = score_subject_match(student_subjects, tutor_subject_slugs)
    grade_score = score_grade_match(student_grades, tutor_grade_slugs)
    return subject_weight * subject_score + grade_weight * grade_score


def has_subject_overlap(
    student_subjects: list[str],
    tutor_subject_slugs: list[str],
) -> bool:
    """
    Hard check: does the tutor teach at least one subject the student needs?
    Used as a pre-filter before scoring.
    """
    if not student_subjects or not tutor_subject_slugs:
        return False
    return bool(set(student_subjects) & set(tutor_subject_slugs))
