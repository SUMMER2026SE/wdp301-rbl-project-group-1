import pandas as pd

from src.models.popularity import popular_candidates


def _score_candidate(row, seed_rows, categorical_columns, numeric_columns):
    score = 0.0

    for column in categorical_columns:
        seed_values = {seed_row[column] for _, seed_row in seed_rows.iterrows() if column in seed_row}
        if row[column] in seed_values:
            score += 1.0

    for column in numeric_columns:
        seed_values = seed_rows[column].dropna()
        if not seed_values.empty and pd.notna(row[column]):
            spread = seed_values.max() - seed_values.min()
            if spread == 0:
                score += 1.0
            else:
                midpoint = seed_values.mean()
                score += max(0.0, 1.0 - abs(row[column] - midpoint) / spread)

    return score


def content_candidates(catalog, seed_ids, id_column="id", top_k=50, categorical_columns=None, numeric_columns=None):
    if catalog is None or catalog.empty:
        return []

    categorical_columns = categorical_columns or []
    numeric_columns = numeric_columns or []

    if not seed_ids:
        return catalog[id_column].head(top_k).tolist()

    seed_rows = catalog[catalog[id_column].isin(seed_ids)]
    if seed_rows.empty:
        return catalog[id_column].head(top_k).tolist()

    ranked_rows = []
    for _, row in catalog.iterrows():
        if row[id_column] in seed_ids:
            continue

        score = _score_candidate(row, seed_rows, categorical_columns, numeric_columns)
        ranked_rows.append((row[id_column], score))

    if not ranked_rows:
        return catalog[id_column].head(top_k).tolist()

    ranked_rows.sort(key=lambda item: item[1], reverse=True)
    return [item_id for item_id, _ in ranked_rows[:top_k]]