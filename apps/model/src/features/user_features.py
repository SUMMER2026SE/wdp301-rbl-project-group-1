import pandas as pd

def build_user_features(interactions):
	if interactions is None or interactions.empty:
		return pd.DataFrame(columns=["user_id"])

	data = interactions.copy()
	if "score" not in data.columns:
		data["score"] = 1

	features = (
		data.groupby("user_id")
		.agg(
			interaction_count=("entity_id", "count"),
			total_score=("score", "sum"),
		)
		.reset_index()
	)

	return features
