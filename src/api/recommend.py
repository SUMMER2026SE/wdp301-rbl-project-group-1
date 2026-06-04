"""
recommend.py — FastAPI router for the Tutor Recommendation API.

Endpoints:
    GET /recommend/tutors/{user_id}
        Query params:
            subject (str?)  — filter by subject slug (e.g., "toan")
            grade   (str?)  — filter by grade slug   (e.g., "lop-11")
            limit   (int)   — number of results (default 10, max 50)

Response shape:
    {
      "user_id":    "...",
      "tutor_ids":  ["t1", "t2", ...],
      "scores": {
          "t1": {"total": 0.83, "semantic": 0.90, "subject_match": 0.75, ...}
      },
      "strategy":   "multi_signal" | "cold_start",
      "cold_start": false
    }
"""
from fastapi import APIRouter, Query

from src.pipelines.tutor_pipeline import recommend_tutors

router = APIRouter(prefix="/recommend", tags=["recommendations"])


@router.get(
    "/tutors/{user_id}",
    summary="Get personalized tutor recommendations for a student",
    response_description="Ranked list of tutor IDs with multi-signal score breakdown",
)
async def get_tutor_recommendations(
    user_id: str,
    subject: str | None = Query(default=None, description="Filter by subject slug, e.g. 'toan'"),
    grade: str | None = Query(default=None, description="Filter by grade slug, e.g. 'lop-11'"),
    limit: int = Query(default=10, ge=1, le=50, description="Number of recommendations"),
):
    result = await recommend_tutors(
        user_id=user_id,
        top_k=limit,
        subject_slug=subject,
        grade_slug=grade,
    )
    return {"user_id": user_id, **result}