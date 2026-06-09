from src.config import execute


def save_tutor_recommendations(user_id, tutors):
    if not tutors:
        return

    for rank, tutor in enumerate(tutors):
        execute("""
        INSERT INTO user_tutor_recommendation
        (user_id, tutor_id, score)
        VALUES (:user_id, :tutor_id, :score)
        """, {"user_id": user_id, "tutor_id": tutor, "score": rank})


def save_course_recommendations(user_id, courses):
    if not courses:
        return

    for rank, course in enumerate(courses):
        execute("""
        INSERT INTO user_course_recommendation
        (user_id, course_id, score)
        VALUES (:user_id, :course_id, :score)
        """, {"user_id": user_id, "course_id": course, "score": rank})