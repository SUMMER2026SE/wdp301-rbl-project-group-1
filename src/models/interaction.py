from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from beanie import Document

class InteractionContext(BaseModel):
    deviceType: Optional[str] = None
    durationSeconds: Optional[int] = None

class Interaction(Document):
    userId: str
    itemId: str
    itemType: str  # "COURSE" or "TUTOR"
    type: str  # e.g., "VIEW", "ENROLL", "CLICK"
    value: float = 1.0
    context: Optional[InteractionContext] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "interactions"
