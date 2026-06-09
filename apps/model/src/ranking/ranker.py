"""
ranker.py
Multi-signal candidate merger and re-ranker for the Tutor recommendation pipeline.

Combines pre-scored candidate lists from multiple strategies using
Reciprocal Rank Fusion (RRF) — position-based, avoids score normalization issues.
"""
from __future__ import annotations


# Default signal weights (mirrors tutor_pipeline.py WEIGHTS for consistency)
DEFAULT_WEIGHTS: dict[str, float] = {
    "semantic":       0.30,
    "subject_match":  0.25,
    "interaction":    0.25,
    "schedule":       0.15,
    "quality":        0.05,
}


def rank_candidates(
    scored_candidates: list[dict],
    weights: dict[str, float] | None = None,
    top_k: int | None = None,
) -> list[str]:
    """
    Re-rank a list of pre-scored candidate dicts by weighted total score.

    Args:
        scored_candidates: list of dicts, each must have:
            {
              "tutor_id":      str,
              "total":         float,   # pre-computed weighted total
              "semantic":      float,
              "subject_match": float,
              "interaction":   float,
              "schedule":      float,
              "quality":       float,
            }
        weights:  optional weight override dict (same keys as DEFAULT_WEIGHTS)
        top_k:    optional limit on returned candidates
    Returns:
        Ordered list of tutor_id strings, highest score first.
    """
    if not scored_candidates:
        return []

    w = weights or DEFAULT_WEIGHTS

    # Re-compute total if custom weights provided
    if weights:
        for c in scored_candidates:
            c["total"] = (
                w.get("semantic",      0) * c.get("semantic",      0)
                + w.get("subject_match", 0) * c.get("subject_match", 0)
                + w.get("interaction",   0) * c.get("interaction",   0)
                + w.get("schedule",      0) * c.get("schedule",      0)
                + w.get("quality",       0) * c.get("quality",       0)
            )

    ranked = sorted(scored_candidates, key=lambda x: x["total"], reverse=True)

    if top_k is not None:
        ranked = ranked[:top_k]

    return [c["tutor_id"] for c in ranked]


def reciprocal_rank_fusion(
    ranked_lists: list[list[str]],
    k: int = 60,
    top_n: int | None = None,
) -> list[str]:
    """
    Merge multiple independently-ranked candidate lists using RRF.
    Useful for combining vector search and subject-filter lists before scoring.

    Formula: RRF(d) = Σ 1 / (k + rank(d))

    Args:
        ranked_lists: list of tutor_id lists, each pre-ranked by a single signal
        k:            RRF constant (default 60 per Cormack et al.)
        top_n:        optional cap on returned candidates
    Returns:
        Merged and re-ranked list of unique tutor_ids.
    """
    scores: dict[str, float] = {}
    for ranked_list in ranked_lists:
        for rank, tutor_id in enumerate(ranked_list, start=1):
            scores[tutor_id] = scores.get(tutor_id, 0.0) + 1.0 / (k + rank)

    merged = sorted(scores, key=scores.get, reverse=True)  # type: ignore[arg-type]
    return merged[:top_n] if top_n else merged