from typing import Any

from src.handlers.base import BaseEventHandler
from src.models.user import User, UserProfile
from src.models.item import Item, BasicInfo, ItemMetrics


class UserCreatedHandler(BaseEventHandler):
    """Persists a new user document to MongoDB when a user registers."""

    async def handle(self, payload: dict[str, Any]) -> None:
        user = User(
            _id=payload.get("id"),
            role=payload.get("role", "STUDENT"),
            profile=UserProfile(
                name=payload.get("name", "Unknown"),
                avatarUrl=payload.get("avatarUrl"),
            ),
            recommendation={
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
            },
        )
        await user.insert()
        print(f"[*] User {user.id} saved to MongoDB.")


class TutorCreatedHandler(BaseEventHandler):
    """Persists a new tutor Item document to MongoDB when a tutor is approved."""

    async def handle(self, payload: dict[str, Any]) -> None:
        item = Item(
            _id=payload.get("id"),
            itemType="TUTOR",
            basicInfo=BasicInfo(
                title=payload.get("name", "Unknown Tutor"),
                thumbnailUrl=payload.get("avatarUrl"),
            ),
            features={
                "specialization": payload.get("specialization"),
                "experience": payload.get("experience", 0),
                "education": payload.get("education"),
                "pricePerHour": payload.get("pricePerHour", 0),
                "subjectSlugs": payload.get("subjectSlugs", []),
                "gradeSlugs": payload.get("gradeSlugs", []),
            },
            metrics=ItemMetrics(),
        )
        await item.insert()
        print(f"[*] Tutor {item.id} saved to MongoDB.")
