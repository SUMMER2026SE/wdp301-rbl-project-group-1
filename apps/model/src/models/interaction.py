from datetime import datetime
from sqlalchemy import String, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from src.models.base import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    userId: Mapped[str] = mapped_column(String, index=True)
    itemId: Mapped[str] = mapped_column(String, index=True)
    itemType: Mapped[str] = mapped_column(String)  # "COURSE" or "TUTOR"
    type: Mapped[str] = mapped_column(String)  # e.g., "VIEW", "ENROLL", "CLICK"
    value: Mapped[float] = mapped_column(Float, default=1.0)
    
    context: Mapped[dict] = mapped_column(JSONB, nullable=True)
    
    createdAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

