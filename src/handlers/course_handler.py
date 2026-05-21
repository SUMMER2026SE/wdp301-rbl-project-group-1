from typing import Any
from sqlalchemy import select
from src.handlers.base import BaseEventHandler
from src.models.item import Item
from src.jobs.embedding_queue import push_to_embedding_queue
from src.config.db import get_session_maker

class CourseCreatedHandler(BaseEventHandler):
    """Persists a new course Item document to Postgres when a course is created."""

    async def handle(self, payload: dict[str, Any]) -> None:
        async_session = get_session_maker()
        async with async_session() as session:
            item = Item(
                id=payload.get("id"),
                itemType="COURSE",
                basicInfo={
                    "title": payload.get("title", "Untitled Course"),
                    "thumbnailUrl": payload.get("thumbnailUrl"),
                },
                features={
                    "tutorId": payload.get("tutorId"),
                    "subjectSlug": payload.get("subjectSlug"),
                    "gradeSlug": payload.get("gradeSlug"),
                    "level": payload.get("level"),
                    "price": payload.get("price", 0),
                },
                metrics={
                    "rating": 0.0,
                    "reviewCount": 0,
                    "viewCount": 0
                },
            )
            session.add(item)
            await session.commit()
            print(f"[*] Course {item.id} saved to Postgres.")
            
        await push_to_embedding_queue({"type": "COURSE", "id": payload.get("id")})

class CourseUpdatedHandler(BaseEventHandler):
    """Updates an existing course Item document in Postgres when a course is modified."""

    async def handle(self, payload: dict[str, Any]) -> None:
        async_session = get_session_maker()
        async with async_session() as session:
            result = await session.execute(select(Item).filter_by(id=payload.get("id")))
            existing = result.scalar_one_or_none()
            
            if not existing:
                print(f"[!] Course {payload.get('id')} not found for update — skipping.")
                return

            # Update JSONB fields properly
            basic_info = dict(existing.basicInfo)
            basic_info["title"] = payload.get("title", basic_info.get("title"))
            basic_info["thumbnailUrl"] = payload.get("thumbnailUrl", basic_info.get("thumbnailUrl"))
            existing.basicInfo = basic_info

            features = dict(existing.features)
            features["subjectSlug"] = payload.get("subjectSlug")
            features["gradeSlug"] = payload.get("gradeSlug")
            features["level"] = payload.get("level")
            features["price"] = payload.get("price", features.get("price", 0))
            existing.features = features

            await session.commit()
            print(f"[*] Course {existing.id} updated in Postgres.")
            
        await push_to_embedding_queue({"type": "COURSE", "id": payload.get("id")})

