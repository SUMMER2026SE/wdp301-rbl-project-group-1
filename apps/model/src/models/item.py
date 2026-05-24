from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
from src.models.base import Base

class Item(Base):
    __tablename__ = "items"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    itemType: Mapped[str] = mapped_column(String)  # "COURSE" or "TUTOR"
    
    basicInfo: Mapped[dict] = mapped_column(JSONB, default=dict)
    features: Mapped[dict] = mapped_column(JSONB, default=dict)
    metrics: Mapped[dict] = mapped_column(JSONB, default=dict)
    
    embeddingVector = mapped_column(Vector(384))
    
    createdAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updatedAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

