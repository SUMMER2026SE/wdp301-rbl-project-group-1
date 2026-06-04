from datetime import datetime
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from src.models.base import Base


class User(Base):
    """
    Read-only mirror of the Prisma `user` table.
    Python only reads `recommendation` JSONB for AI inference.

    recommendation JSONB layout:
        {
          "explicitPreferences": {
            "subjectSlugs": ["toan", "ly"],
            "gradeSlugs":   ["lop-11"]
          },
          "implicitPreferences": {
            "viewedTutorIds":  ["tutorId1", ...],
            "bookedTutorIds":  ["tutorId2", ...]
          },
          "embeddingVector": [0.12, -0.34, ...]   # 384 dims
        }
    """

    __tablename__ = "user"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    role: Mapped[str] = mapped_column(String)

    # AI recommendation payload — managed by Python, read by pipeline
    recommendation: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, name="created_at"
    )
