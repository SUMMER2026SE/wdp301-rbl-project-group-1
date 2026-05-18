from typing import List, Optional, Union, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from beanie import Document

class BasicInfo(BaseModel):
    title: str
    thumbnailUrl: Optional[str] = None

class ItemMetrics(BaseModel):
    rating: float = 0.0
    reviewCount: int = 0
    viewCount: int = 0
    enrollmentCount: Optional[int] = None
    studentCount: Optional[int] = None

class Item(Document):
    id: str = Field(alias="_id")
    itemType: str  # "COURSE" or "TUTOR"
    basicInfo: BasicInfo
    features: Dict[str, Any]  # Flexible schema for course vs tutor features
    metrics: ItemMetrics
    embeddingVector: List[float] = Field(default_factory=list)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "items"
