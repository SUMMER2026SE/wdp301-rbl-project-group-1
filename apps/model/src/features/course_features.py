import pandas as pd


def build_course_features(courses):
	if courses is None or courses.empty:
		return pd.DataFrame(columns=["id"])

	features = courses.copy()
	for column in ["price"]:
		if column in features.columns:
			features[column] = pd.to_numeric(features[column], errors="coerce").fillna(0)

	return features
