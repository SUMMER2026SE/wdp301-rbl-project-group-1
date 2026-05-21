import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv


# Import models
from src.models.user import User
from src.models.item import Item
from src.models.interaction import Interaction


load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")


async def init_db():
    if not MONGO_URI:
        raise ValueError("MONGO_URI environment variable is missing.")


    # Create Motor client
    client = AsyncIOMotorClient(MONGO_URI)
   
    # WORKAROUND: Beanie >= 1.25.0 calls 'append_metadata' on the client,
    # but Motor >= 3.6.0 doesn't expose it, leading to a TypeError.
    # Monkey-patching it here prevents the crash.
    if not hasattr(AsyncIOMotorClient, 'append_metadata'):
        AsyncIOMotorClient.append_metadata = lambda self, *args, **kwargs: None


    # Get database (from URI or specify name)
    db = client.get_default_database()


    # Initialize Beanie with all models
    await init_beanie(
        database=db,
        document_models=[
            User,
            Item,
            Interaction
        ]
    )
    print(f"[*] [MongoDB] Connected successfully to '{db.name}' via Beanie.")
