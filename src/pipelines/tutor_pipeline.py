from src.data.loader import load_interactions, load_tutors
from src.models.collaborative import collaborative_candidates
from src.models.content_based import content_candidates
from src.models.popularity import popular_candidates
from src.ranking.ranker import rank_candidates


def recommend_tutors(user_id):
    interactions = load_interactions()
    tutors = load_tutors()

    collab = collaborative_candidates(interactions, user_id, entity_type="TUTOR")
    content = content_candidates(
        tutors,
        seed_ids=interactions.loc[
            (interactions["user_id"] == user_id) & (interactions["entity_type"] == "TUTOR"),
            "entity_id",
        ].dropna().unique().tolist(),
        id_column="id",
        top_k=50,
        numeric_columns=[column for column in ["rating", "student_count", "price_per_hour", "experience"] if column in tutors.columns],
    )
    popular = popular_candidates(interactions, top_k=50, entity_type="TUTOR")

    ranked = rank_candidates(collab, content, popular)

    return ranked[:10]