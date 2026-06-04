from datetime import datetime
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
from src.models.base import Base


class TutorItem(Base):
    """
    AI-layer denormalized representation of a Tutor.
    Managed by Python; synced from NestJS via RabbitMQ events.

    features JSONB layout:
        {
          "subjectSlugs":      ["toan", "ly"],
          "gradeSlugs":        ["lop-10", "lop-11"],
          "specialization":    "Toán cao cấp",
          "experience":        3,
          "pricePerHour":      150000,
          "availabilitySlots": [
            {"dayOfWeek": 2, "startTime": "08:00", "endTime": "10:00"},
            ...
          ]
        }

    metrics JSONB layout:
        {
          "rating":       4.5,
          "reviewCount":  12,
          "studentCount": 8,
          "bookingCount": 15
        }
    """

    __tablename__ = "tutor_items"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    item_type: Mapped[str] = mapped_column(String, default="TUTOR", name="item_type")

    basic_info: Mapped[dict] = mapped_column(JSONB, default=dict, name="basic_info")
    features: Mapped[dict] = mapped_column(JSONB, default=dict)
    metrics: Mapped[dict] = mapped_column(JSONB, default=dict)

    # pgvector column: intfloat/multilingual-e5-small = 384 dims
    embedding_vector = mapped_column(Vector(384), name="embedding_vector", nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, name="created_at"
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, name="updated_at"
    )
