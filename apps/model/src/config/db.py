import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy import text
from dotenv import load_dotenv
from src.models.base import Base
# Import all models to ensure they are registered with Base.metadata
from src.models.user import User
from src.models.tutor_item import TutorItem
from src.models.interaction import TutorInteraction

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = None
async_session_maker = None

async def init_db():
    global engine, async_session_maker
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is missing.")

    # asyncpg expects 'ssl' instead of 'sslmode'
    db_url = DATABASE_URL.replace("sslmode=", "ssl=")
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+asyncpg://"):
        db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

    # Create async engine
    engine = create_async_engine(db_url, echo=False)
    
    # Create session factory
    async_session_maker = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with engine.begin() as conn:
        # Ensure pgvector extension exists
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        # Create tables
        await conn.run_sync(Base.metadata.create_all)

    print(f"[*] [PostgreSQL] Connected and initialized tables via SQLAlchemy.")

def get_session_maker():
    if not async_session_maker:
        raise RuntimeError("Database not initialized.")
    return async_session_maker
