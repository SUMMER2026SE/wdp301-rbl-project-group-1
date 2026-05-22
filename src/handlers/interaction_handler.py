from typing import Any
from sqlalchemy import select
from src.handlers.base import BaseEventHandler
from src.models.interaction import Interaction
from src.models.user import User
from src.models.item import Item
from src.config.db import get_session_maker

class InteractionLoggedHandler(BaseEventHandler):
    """Persists a user interaction (enrollment, view, rating) to Postgres and dynamically updates User embedding."""

    async def handle(self, payload: dict[str, Any]) -> None:
        async_session = get_session_maker()
        async with async_session() as session:
            interaction = Interaction(
                userId=payload.get("userId"),
                itemId=payload.get("itemId"),
                itemType=payload.get("itemType", "COURSE"),
                type=payload.get("interactionType", "VIEW"),
                value=payload.get("value", 1.0),
                context={
                    "deviceType": payload.get("deviceType"),
                },
            )
            session.add(interaction)
            await session.commit()
            print(f"[*] Interaction ({interaction.type}) saved to Postgres.")

            # --- Dynamic Embedding Update ---
            user_res = await session.execute(select(User).filter_by(id=interaction.userId))
            user = user_res.scalar_one_or_none()
            
            item_res = await session.execute(select(Item).filter_by(id=interaction.itemId))
            item = item_res.scalar_one_or_none()

            if user and item and user.recommendation and item.embeddingVector is not None:
                # Determine alpha weight based on interaction type
                alpha = 0.05
                if interaction.type == "ENROLL":
                    alpha = 0.20
                elif interaction.type == "RATING":
                    alpha = 0.10

                rec_data = dict(user.recommendation)
                user_vector = rec_data.get("embeddingVector")
                # pgvector returns a numpy array or list, we can iterate it
                item_vector = item.embeddingVector

                if not user_vector:
                    # Cold start: assign item vector directly
                    rec_data["embeddingVector"] = list(item_vector)
                    user.recommendation = rec_data
                    print(f"[*] Initialized User {user.id} vector from Item {item.id}.")
                else:
                    # Calculate weighted average
                    new_vector = [(1 - alpha) * u + alpha * i for u, i in zip(user_vector, item_vector)]
                    rec_data["embeddingVector"] = new_vector
                    user.recommendation = rec_data
                    print(f"[*] Updated User {user.id} vector (shifted towards Item {item.id} with alpha={alpha}).")

                # Need to update the JSONB column by assigning it a new dict
                from sqlalchemy.orm.attributes import flag_modified
                flag_modified(user, "recommendation")
                await session.commit()

