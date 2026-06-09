from pathlib import Path
import sys

ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from src.data.loader import load_users
from src.pipelines.tutor_pipeline import recommend_tutors
from src.pipelines.course_pipeline import recommend_courses
from src.storage.save_results import save_course_recommendations, save_tutor_recommendations

def train():
    users = load_users()

    if users.empty:
        print("[TRAIN] No users found, skipping recommendation generation")
        return

    for user_id in users["id"].tolist():
        tutors = recommend_tutors(user_id)
        courses = recommend_courses(user_id)

        save_tutor_recommendations(user_id, tutors)
        save_course_recommendations(user_id, courses)

    print("[TRAIN] Recommendation generation completed")


if __name__ == "__main__":
    train()