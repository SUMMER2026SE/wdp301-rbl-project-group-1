from src.config.settings import EVENT_WEIGHTS

def add_score(df):
    processed = df.copy()
    processed["score"] = processed["event_type"].map(EVENT_WEIGHTS).fillna(1)
    return processed