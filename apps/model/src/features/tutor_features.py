import pandas as pd


def build_tutor_features(tutors):
	if tutors is None or tutors.empty:
		return pd.DataFrame(columns=["id"])

	features = tutors.copy()
	for column in ["rating", "student_count", "price_per_hour", "experience"]:
		if column in features.columns:
			features[column] = pd.to_numeric(features[column], errors="coerce").fillna(0)

	return features
