from fastapi import APIRouter

from src.pipelines.course_pipeline import recommend_courses
from src.pipelines.tutor_pipeline import recommend_tutors

router = APIRouter(prefix="/recommend", tags=["recommendations"])


def get_tutor_recommend(user_id):
    return recommend_tutors(user_id)


def get_course_recommend(user_id):
    return recommend_courses(user_id)


@router.get("/{user_id}")
def get_recommendation_result(user_id: str):
    tutor_recommendations = get_tutor_recommend(user_id)
    course_recommendations = get_course_recommend(user_id)

    return {
        "user_id": user_id,
        "tutor_recommendations": tutor_recommendations,
        "course_recommendations": course_recommendations,
    }