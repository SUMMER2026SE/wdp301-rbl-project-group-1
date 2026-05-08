from src.data.loader import load_courses, load_interactions
from src.models.collaborative import collaborative_candidates
from src.models.content_based import content_candidates
from src.models.popularity import popular_candidates
from src.ranking.ranker import rank_candidates


def recommend_courses(user_id):
    interactions = load_interactions()
    courses = load_courses()

    collab = collaborative_candidates(interactions, user_id, entity_type="COURSE")
    content = content_candidates(
        courses,
        seed_ids=interactions.loc[
            (interactions["user_id"] == user_id) & (interactions["entity_type"] == "COURSE"),
            "entity_id",
        ].dropna().unique().tolist(),
        id_column="id",
        top_k=50,
        categorical_columns=[column for column in ["tutor_id", "subject_id", "grade_id", "level", "status"] if column in courses.columns],
        numeric_columns=[column for column in ["price"] if column in courses.columns],
    )
    popular = popular_candidates(interactions, top_k=50, entity_type="COURSE")

    ranked = rank_candidates(collab, content, popular)

    return ranked[:10]