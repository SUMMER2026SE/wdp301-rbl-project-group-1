from fastapi import APIRouter

from src.pipelines.course_pipeline import recommend_courses
from src.pipelines.tutor_pipeline import recommend_tutors

router = APIRouter(prefix="/recommend", tags=["recommendations"])


@router.get("/courses/{user_id}")
async def get_course_recommendation(user_id: str):
    course_recommendations = await recommend_courses(user_id)
    return {
        "user_id": user_id,
        "course_recommendations": course_recommendations,
    }


@router.get("/tutors/{user_id}")
async def get_tutor_recommendation(user_id: str):
    tutor_recommendations = await recommend_tutors(user_id)
    return {
        "user_id": user_id,
        "tutor_recommendations": tutor_recommendations,
    }