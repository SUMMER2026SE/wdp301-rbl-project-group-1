from pathlib import Path

import pandas as pd

from src.config import query
from src.data.preprocess import add_score

DATA_DIR = Path(__file__).resolve().parents[2] / "data"


def _empty_frame(columns):
    return pd.DataFrame(columns=columns)


def _load_csv_if_available(file_name, columns):
    file_path = DATA_DIR / file_name
    if not file_path.exists() or file_path.stat().st_size == 0:
        return _empty_frame(columns)

    data = pd.read_csv(file_path)
    missing_columns = [column for column in columns if column not in data.columns]
    for column in missing_columns:
        data[column] = pd.NA

    return data[columns]


def _safe_query(sql, columns):
    try:
        return query(sql)
    except Exception:
        return _empty_frame(columns)

def load_interactions():
    interactions = _safe_query("""
        SELECT id, user_id, entity_id, entity_type, event_type, weight, created_at
        FROM interaction
    """, ["id", "user_id", "entity_id", "entity_type", "event_type", "weight", "created_at"])

    if interactions.empty:
        interactions = _load_csv_if_available(
            "interactions.csv",
            ["user_id", "entity_id", "entity_type", "event_type"],
        )

    if "score" not in interactions.columns:
        interactions = add_score(interactions)

    return interactions

def load_tutors():
    return _safe_query("""
        SELECT id, rating, student_count, price_per_hour, bio, specialization, experience, education
        FROM tutor
    """, ["id", "rating", "student_count", "price_per_hour", "bio", "specialization", "experience", "education"])

def load_courses():
    return _safe_query("""
        SELECT id, tutor_id, subject_id, grade_id, title, description, price, level, status
        FROM course
    """, ["id", "tutor_id", "subject_id", "grade_id", "title", "description", "price", "level", "status"])


def load_users():
    return _safe_query("""
        SELECT id, email, role, is_active, is_verified, created_at
        FROM "user"
    """, ["id", "email", "role", "is_active", "is_verified", "created_at"])


def load_data():
    return load_interactions()