from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from src.models.base import Base

class User(Base):
    __tablename__ = "user"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    role: Mapped[str] = mapped_column(String)
    
    # We only need the recommendation column for AI. 
    # Profile data is managed by the Backend Prisma in a separate relational table.
    recommendation: Mapped[dict] = mapped_column(JSONB, nullable=True)
    
    createdAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, name="created_at")

