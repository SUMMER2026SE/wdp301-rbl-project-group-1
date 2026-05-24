from typing import List
from sqlalchemy import select
from src.models.user import User
from src.models.item import Item
from src.config.db import get_session_maker

async def recommend_courses(user_id: str, top_k: int = 10) -> List[str]:
    """
    Generate course recommendations for a given user.
    Uses Vector Cosine Similarity via pgvector if the user has an embedding vector.
    Falls back to Popular/Recent courses (Cold Start) otherwise.
    """
    async_session = get_session_maker()
    async with async_session() as session:
        user_res = await session.execute(select(User).filter_by(id=user_id))
        user = user_res.scalar_one_or_none()
        
        # 1. Cold Start Fallback
        if not user or not user.recommendation or not user.recommendation.get("embeddingVector"):
            print(f"[*] [CoursePipeline] User {user_id} has no vector. Using Cold Start fallback.")
            return await _get_popular_courses(session, top_k)
            
        user_vector = user.recommendation.get("embeddingVector")
        
        # 2. Vector Similarity Search using pgvector
        # .cosine_distance() maps to `<=>` in postgres
        stmt = (
            select(Item.id)
            .filter(Item.itemType == "COURSE", Item.embeddingVector.is_not(None))
            .order_by(Item.embeddingVector.cosine_distance(user_vector))
            .limit(top_k)
        )
        result = await session.execute(stmt)
        recommended_ids = list(result.scalars().all())
        
        # 3. Fallback if something failed (e.g., no courses had vectors)
        if not recommended_ids:
            print(f"[*] [CoursePipeline] Vector similarity returned empty. Using Cold Start fallback.")
            return await _get_popular_courses(session, top_k)
            
        print(f"[*] [CoursePipeline] Recommended {len(recommended_ids)} courses for user {user_id}.")
        return recommended_ids

async def _get_popular_courses(session, top_k: int) -> List[str]:
    """Fallback logic to get most popular or recently created courses."""
    # Since metrics is JSONB, we can sort by a field within it.
    # In a real app, you might want to cast it: Item.metrics['viewCount'].as_integer()
    stmt = (
        select(Item.id)
        .filter(Item.itemType == "COURSE")
        .order_by(Item.createdAt.desc())
        .limit(top_k)
    )
    result = await session.execute(stmt)
    return list(result.scalars().all())