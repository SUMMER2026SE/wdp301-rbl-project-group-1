import pandas as pd

from src.data.preprocess import add_score
from src.models.user import User
from src.models.item import Item
from src.models.interaction import Interaction

async def load_interactions():
    docs = await Interaction.find_all().to_list()
    
    if not docs:
        df = pd.DataFrame(columns=["id", "user_id", "entity_id", "entity_type", "event_type", "weight", "created_at"])
    else:
        data = []
        for doc in docs:
            data.append({
                "id": str(doc.id),
                "user_id": doc.userId,
                "entity_id": doc.itemId,
                "entity_type": doc.itemType,
                "event_type": doc.type,
                "weight": doc.value,
                "created_at": doc.createdAt
            })
        df = pd.DataFrame(data)

    if not df.empty and "score" not in df.columns:
        df = add_score(df)

    return df


async def load_tutors():
    docs = await Item.find(Item.itemType == "TUTOR").to_list()
    
    if not docs:
        return pd.DataFrame(columns=["id", "rating", "student_count", "price_per_hour", "bio", "specialization", "experience", "education"])
    
    data = []
    for doc in docs:
        features = doc.features or {}
        metrics = doc.metrics
        data.append({
            "id": str(doc.id),
            "rating": metrics.rating if metrics else 0.0,
            "student_count": metrics.studentCount if metrics else 0,
            "price_per_hour": features.get("pricePerHour", 0),
            "bio": doc.basicInfo.title if doc.basicInfo else "",
            "specialization": features.get("specialization"),
            "experience": features.get("experience", 0),
            "education": features.get("education"),
        })
    return pd.DataFrame(data)


async def load_courses():
    docs = await Item.find(Item.itemType == "COURSE").to_list()
    
    if not docs:
        return pd.DataFrame(columns=["id", "tutor_id", "subject_id", "grade_id", "title", "description", "price", "level", "status"])
    
    data = []
    for doc in docs:
        features = doc.features or {}
        metrics = doc.metrics
        data.append({
            "id": str(doc.id),
            "title": doc.basicInfo.title if doc.basicInfo else "",
            "description": "", # Mapping placeholder
            "price": features.get("price", 0),
            "tutor_id": features.get("tutorId"),
            "subject_id": features.get("subjectSlug"),
            "grade_id": features.get("gradeSlug"),
            "level": features.get("level"),
            "status": "PUBLISHED",
        })
    return pd.DataFrame(data)


async def load_users():
    docs = await User.find_all().to_list()
    
    if not docs:
        return pd.DataFrame(columns=["id", "email", "role", "is_active", "is_verified", "created_at"])
    
    data = []
    for doc in docs:
        data.append({
            "id": str(doc.id),
            "email": "",
            "role": doc.role,
            "is_active": True,
            "is_verified": True,
            "created_at": doc.createdAt,
        })
    return pd.DataFrame(data)


async def load_data():
    return await load_interactions()