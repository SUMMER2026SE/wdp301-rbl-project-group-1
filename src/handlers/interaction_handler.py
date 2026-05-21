from typing import Any

from src.handlers.base import BaseEventHandler
from src.models.interaction import Interaction, InteractionContext
from src.models.user import User
from src.models.item import Item

class InteractionLoggedHandler(BaseEventHandler):
    """Persists a user interaction (enrollment, view, rating) to MongoDB and dynamically updates User embedding."""

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

        # --- Dynamic Embedding Update ---
        user = await User.find_one(User.id == interaction.userId)
        item = await Item.find_one(Item.id == interaction.itemId)

        if user and item and user.recommendation and item.embeddingVector:
            # Determine alpha weight based on interaction type
            alpha = 0.05
            if interaction.type == "ENROLL":
                alpha = 0.20
            elif interaction.type == "RATING":
                # E.g. scale by rating if we wanted, but keep it fixed at 0.10 for now
                alpha = 0.10

            user_vector = user.recommendation.embeddingVector
            item_vector = item.embeddingVector

            if not user_vector:
                # Cold start: assign item vector directly
                user.recommendation.embeddingVector = item_vector
                print(f"[*] Initialized User {user.id} vector from Item {item.id}.")
            else:
                # Calculate weighted average
                new_vector = [(1 - alpha) * u + alpha * i for u, i in zip(user_vector, item_vector)]
                user.recommendation.embeddingVector = new_vector
                print(f"[*] Updated User {user.id} vector (shifted towards Item {item.id} with alpha={alpha}).")

            await user.save()
