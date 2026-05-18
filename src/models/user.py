from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from beanie import Document

class UserProfile(BaseModel):
    name: str
    avatarUrl: Optional[str] = None

class TagWeight(BaseModel):
    tagSlug: str
    weight: float

class SubjectWeight(BaseModel):
    subjectSlug: str
    weight: float

class ExplicitPreferences(BaseModel):
    subjectSlugs: List[str] = Field(default_factory=list)
    gradeSlugs: List[str] = Field(default_factory=list)
    tagSlugs: List[str] = Field(default_factory=list)

class ImplicitPreferences(BaseModel):
    favoriteTags: List[TagWeight] = Field(default_factory=list)
    favoriteSubjects: List[SubjectWeight] = Field(default_factory=list)

class RecommendationData(BaseModel):
    explicitPreferences: ExplicitPreferences
    implicitPreferences: ImplicitPreferences
    embeddingVector: List[float] = Field(default_factory=list)

class User(Document):
    id: str = Field(alias="_id")
    role: str
    profile: UserProfile
    recommendation: Optional[RecommendationData] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
