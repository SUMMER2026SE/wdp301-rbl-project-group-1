from typing import Any

from src.handlers.base import BaseEventHandler
from src.models.interaction import Interaction, InteractionContext


class InteractionLoggedHandler(BaseEventHandler):
    """Persists a user interaction (enrollment, view, rating) to MongoDB."""

    async def handle(self, payload: dict[str, Any]) -> None:
        interaction = Interaction(
            userId=payload.get("userId"),
            itemId=payload.get("itemId"),
            itemType=payload.get("itemType", "COURSE"),
            type=payload.get("interactionType", "VIEW"),
            value=payload.get("value", 1.0),
            context=InteractionContext(
                deviceType=payload.get("deviceType"),
            ),
        )
        await interaction.insert()
        print(f"[*] Interaction ({interaction.type}) saved to MongoDB.")
