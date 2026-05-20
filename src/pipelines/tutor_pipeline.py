from typing import List
from src.models.user import User
from src.models.item import Item
from src.algorithms.similarity import calculate_cosine_similarity

async def recommend_tutors(user_id: str, top_k: int = 10) -> List[str]:
    """
    Generate tutor recommendations for a given user.
    Uses Vector Cosine Similarity if the user has an embedding vector.
    Falls back to Popular/Recent tutors (Cold Start) otherwise.
    """
    user = await User.find_one(User.id == user_id)
    
    # 1. Cold Start Fallback
    if not user or not user.recommendation or not user.recommendation.embeddingVector:
        print(f"[*] [TutorPipeline] User {user_id} has no vector. Using Cold Start fallback.")
        return await _get_popular_tutors(top_k)
        
    user_vector = user.recommendation.embeddingVector
    
    # 2. Fetch all tutors
    tutors = await Item.find(Item.itemType == "TUTOR").to_list()
    
    if not tutors:
        return []
        
    # Prepare items for similarity calculation
    items_data = []
    for tutor in tutors:
        if tutor.embeddingVector:
            items_data.append({
                "id": str(tutor.id),
                "vector": tutor.embeddingVector
            })
            
    # 3. Calculate similarities
    recommended_ids = calculate_cosine_similarity(user_vector, items_data, top_k=top_k)
    
    # 4. Fallback if something failed
    if not recommended_ids:
        print(f"[*] [TutorPipeline] Vector similarity returned empty. Using Cold Start fallback.")
        return await _get_popular_tutors(top_k)
        
    print(f"[*] [TutorPipeline] Recommended {len(recommended_ids)} tutors for user {user_id}.")
    return recommended_ids

async def _get_popular_tutors(top_k: int) -> List[str]:
    """Fallback logic to get most popular or recently created tutors."""
    # Sort by rating or reviewCount
    tutors = await Item.find(Item.itemType == "TUTOR").sort("-metrics.rating", "-metrics.reviewCount").limit(top_k).to_list()
    return [str(tutor.id) for tutor in tutors]