from typing import Any
from sqlalchemy import select
from src.handlers.base import BaseEventHandler
from src.models.user import User
from src.models.item import Item
from src.jobs.embedding_queue import push_to_embedding_queue
from src.config.db import get_session_maker

class UserCreatedHandler(BaseEventHandler):
    """Initializes recommendation data for a new user."""

    async def handle(self, payload: dict[str, Any]) -> None:
        async_session = get_session_maker()
        async with async_session() as session:
            result = await session.execute(select(User).filter_by(id=payload.get("id")))
            user = result.scalar_one_or_none()
            
            if not user:
                print(f"[!] User {payload.get('id')} not found in DB! Backend must insert first.")
                return
                
            user.recommendation = {
                "explicitPreferences": {
                    "subjectSlugs": payload.get("subjectSlugs", []),
                    "gradeSlugs": payload.get("gradeSlugs", []),
                    "tagSlugs": [],
                },
                "implicitPreferences": {
                    "favoriteTags": [],
                    "favoriteSubjects": [],
                },
                "embeddingVector": [],
            }
            
            await session.commit()
            print(f"[*] User {user.id} recommendation data initialized in Postgres.")
            
        await push_to_embedding_queue({"type": "USER", "id": payload.get("id")})

class TutorCreatedHandler(BaseEventHandler):
    """Persists a new tutor Item document to Postgres when a tutor is approved."""

    async def handle(self, payload: dict[str, Any]) -> None:
        async_session = get_session_maker()
        async with async_session() as session:
            item = Item(
                id=payload.get("id"),
                itemType="TUTOR",
                basicInfo={
                    "title": payload.get("name", "Unknown Tutor"),
                    "thumbnailUrl": payload.get("avatarUrl"),
                },
                features={
                    "specialization": payload.get("specialization"),
                    "experience": payload.get("experience", 0),
                    "education": payload.get("education"),
                    "pricePerHour": payload.get("pricePerHour", 0),
                    "subjectSlugs": payload.get("subjectSlugs", []),
                    "gradeSlugs": payload.get("gradeSlugs", []),
                },
                metrics={
                    "rating": 0.0,
                    "reviewCount": 0,
                    "viewCount": 0
                },
            )
            session.add(item)
            await session.commit()
            print(f"[*] Tutor {item.id} saved to Postgres.")

