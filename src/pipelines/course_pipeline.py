from typing import List
from src.models.user import User
from src.models.item import Item
from src.algorithms.similarity import calculate_cosine_similarity

async def recommend_courses(user_id: str, top_k: int = 10) -> List[str]:
    """
    Generate course recommendations for a given user.
    Uses Vector Cosine Similarity if the user has an embedding vector.
    Falls back to Popular/Recent courses (Cold Start) otherwise.
    """
    user = await User.find_one(User.id == user_id)
    
    # 1. Cold Start Fallback (User not found or no embedding vector)
    if not user or not user.recommendation or not user.recommendation.embeddingVector:
        print(f"[*] [CoursePipeline] User {user_id} has no vector. Using Cold Start fallback.")
        return await _get_popular_courses(top_k)
        
    user_vector = user.recommendation.embeddingVector
    
    # 2. Fetch all courses (In production, this should use Vector DB like Pinecone/Milvus or Mongo Atlas Vector Search)
    # For now, fetching all and calculating in memory since dataset is small.
    courses = await Item.find(Item.itemType == "COURSE").to_list()
    
    if not courses:
        return []
        
    # Prepare items for similarity calculation
    items_data = []
    for course in courses:
        if course.embeddingVector:
            items_data.append({
                "id": str(course.id),
                "vector": course.embeddingVector
            })
            
    # 3. Calculate similarities
    recommended_ids = calculate_cosine_similarity(user_vector, items_data, top_k=top_k)
    
    # 4. Fallback if something failed (e.g., no courses had vectors)
    if not recommended_ids:
        print(f"[*] [CoursePipeline] Vector similarity returned empty. Using Cold Start fallback.")
        return await _get_popular_courses(top_k)
        
    print(f"[*] [CoursePipeline] Recommended {len(recommended_ids)} courses for user {user_id}.")
    return recommended_ids

async def _get_popular_courses(top_k: int) -> List[str]:
    """Fallback logic to get most popular or recently created courses."""
    # Example: Sort by viewCount descending (or studentCount)
    courses = await Item.find(Item.itemType == "COURSE").sort("-metrics.viewCount", "-createdAt").limit(top_k).to_list()
    return [str(course.id) for course in courses]