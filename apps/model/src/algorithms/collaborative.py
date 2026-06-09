from src.algorithms.popularity import popular_candidates


def collaborative_candidates(interactions, user_id, top_k=50, entity_type=None):
    if interactions is None or interactions.empty:
        return []

    data = interactions.copy()
    if "score" not in data.columns:
        data["score"] = 1

    if entity_type is not None and "entity_type" in data.columns:
        data = data[data["entity_type"] == entity_type]

    if data.empty:
        return []

    user_items = data.loc[data["user_id"] == user_id, "entity_id"].dropna().unique().tolist()
    if not user_items:
        return popular_candidates(data, top_k=top_k, entity_type=entity_type)

    peer_rows = data[(data["entity_id"].isin(user_items)) & (data["user_id"] != user_id)]
    if peer_rows.empty:
        return popular_candidates(data, top_k=top_k, entity_type=entity_type)

    peer_strength = peer_rows.groupby("user_id")["score"].sum()
    scored = data[data["user_id"].isin(peer_strength.index)].copy()
    scored["peer_weight"] = scored["user_id"].map(peer_strength).fillna(1)
    scored["combined_score"] = scored["score"] * scored["peer_weight"]

    recommendations = (
        scored[~scored["entity_id"].isin(user_items)]
        .groupby("entity_id")["combined_score"]
        .sum()
        .sort_values(ascending=False)
    )

    if recommendations.empty:
        return popular_candidates(data, top_k=top_k, entity_type=entity_type)

    return recommendations.head(top_k).index.tolist()


class CollaborativeFiltering:
    def fit(self, interactions):
        self.interactions = interactions.copy()
        return self

    def recommend(self, user_id, top_k=10, entity_type=None):
        if not hasattr(self, "interactions"):
            return []

        return collaborative_candidates(
            self.interactions,
            user_id=user_id,
            top_k=top_k,
            entity_type=entity_type,
        )