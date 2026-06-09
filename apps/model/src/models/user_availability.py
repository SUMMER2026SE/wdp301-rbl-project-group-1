from datetime import datetime
from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from src.models.base import Base


class UserAvailability(Base):
    """
    Read-only mirror of the Prisma `user_availability` table.
    Managed by NestJS — Python only reads this table for schedule scoring.

    dayOfWeek: 0 = Sunday, 1 = Monday, ..., 6 = Saturday (ISO: 1=Mon..7=Sun).
    startTime / endTime: "HH:MM" 24h strings, e.g. "08:00", "20:30"
    """

    __tablename__ = "user_availability"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    user_id: Mapped[str] = mapped_column(String, index=True, name="user_id")
    day_of_week: Mapped[int] = mapped_column(Integer, name="day_of_week")
    start_time: Mapped[str] = mapped_column(String, name="start_time")
    end_time: Mapped[str] = mapped_column(String, name="end_time")
    created_at: Mapped[datetime] = mapped_column(DateTime, name="created_at")
    updated_at: Mapped[datetime] = mapped_column(DateTime, name="updated_at")
