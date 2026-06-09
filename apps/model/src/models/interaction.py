from datetime import datetime
from sqlalchemy import String, Integer, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from src.models.base import Base


# Interaction type → pre-computed weight mapping (mirrors Python layer constants)
INTERACTION_WEIGHTS: dict[str, float] = {
    "VIEW_PROFILE":       0.05,
    "BOOKING_CREATED":    0.40,
    "BOOKING_COMPLETED":  0.50,
    "RATING":             0.30,
    "BID_ACCEPTED":       0.20,
}


class TutorInteraction(Base):
    """
    Stores tutor-specific interaction events published by NestJS via RabbitMQ.
    Used to build the interaction_score signal in the recommendation pipeline.

    context JSONB examples:
        RATING:            {"ratingValue": 4.5}
        BOOKING_CREATED:   {"subjectSlug": "toan", "gradeSlug": "lop-11"}
        VIEW_PROFILE:      {"deviceType": "mobile"}
    """

    __tablename__ = "tutor_interactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String, index=True, name="user_id")
    tutor_id: Mapped[str] = mapped_column(String, index=True, name="tutor_id")
    type: Mapped[str] = mapped_column(String, index=True)
    value: Mapped[float] = mapped_column(Float, default=1.0)
    context: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, name="created_at"
    )
