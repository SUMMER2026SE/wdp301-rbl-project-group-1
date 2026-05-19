from typing import Any

from src.handlers.base import BaseEventHandler
from src.models.item import Item, BasicInfo, ItemMetrics


class CourseCreatedHandler(BaseEventHandler):
    """Persists a new course Item document to MongoDB when a course is created."""

    async def handle(self, payload: dict[str, Any]) -> None:
        item = Item(
            _id=payload.get("id"),
            itemType="COURSE",
            basicInfo=BasicInfo(
                title=payload.get("title", "Untitled Course"),
                thumbnailUrl=payload.get("thumbnailUrl"),
            ),
            features={
                "tutorId": payload.get("tutorId"),
                "subjectSlug": payload.get("subjectSlug"),
                "gradeSlug": payload.get("gradeSlug"),
                "level": payload.get("level"),
                "price": payload.get("price", 0),
            },
            metrics=ItemMetrics(),
        )
        await item.insert()
        print(f"[*] Course {item.id} saved to MongoDB.")


class CourseUpdatedHandler(BaseEventHandler):
    """Updates an existing course Item document in MongoDB when a course is modified."""

    async def handle(self, payload: dict[str, Any]) -> None:
        existing = await Item.find_one(Item.id == payload.get("id"))
        if not existing:
            print(f"[!] Course {payload.get('id')} not found for update — skipping.")
            return

        existing.basicInfo.title = payload.get("title", existing.basicInfo.title)
        existing.basicInfo.thumbnailUrl = payload.get("thumbnailUrl", existing.basicInfo.thumbnailUrl)
        existing.features["subjectSlug"] = payload.get("subjectSlug")
        existing.features["gradeSlug"] = payload.get("gradeSlug")
        existing.features["level"] = payload.get("level")
        existing.features["price"] = payload.get("price", existing.features.get("price", 0))

        await existing.save()
        print(f"[*] Course {existing.id} updated in MongoDB.")
