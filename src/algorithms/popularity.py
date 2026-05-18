from src.config.settings import EVENT_WEIGHTS


def _ensure_score(df):
    scored = df.copy()
    if "score" not in scored.columns:
        if "weight" in scored.columns:
            scored["score"] = scored["weight"].fillna(1)
        elif "event_type" in scored.columns:
            scored["score"] = scored["event_type"].map(EVENT_WEIGHTS).fillna(1)
        else:
            scored["score"] = 1
    return scored


def popular_candidates(df, top_k=50, entity_type=None):
    scored = _ensure_score(df)

    if entity_type is not None and "entity_type" in scored.columns:
        scored = scored[scored["entity_type"] == entity_type]

    if scored.empty:
        return []

    return (
        scored.groupby("entity_id")["score"]
        .sum()
        .sort_values(ascending=False)
        .head(top_k)
        .index
        .tolist()
    )