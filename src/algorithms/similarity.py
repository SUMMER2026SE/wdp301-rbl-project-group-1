import numpy as np
from typing import List, Dict, Any

def calculate_cosine_similarity(user_vector: List[float], items: List[Dict[str, Any]], top_k: int = 10) -> List[str]:
    """
    Calculates cosine similarity between a user vector and a list of item vectors.
    Returns the top_k item IDs sorted by similarity (highest first).
    
    items should be a list of dicts: [{"id": "item1", "vector": [...]}, ...]
    """
    if not items or not user_vector:
        return []
        
    # Convert lists to numpy arrays
    u_vec = np.array(user_vector)
    
    # Filter out items that don't have a valid vector
    valid_items = [item for item in items if item.get("vector") and len(item["vector"]) == len(u_vec)]
    if not valid_items:
        return []
        
    # Create an item matrix where each row is an item vector
    item_matrix = np.array([item["vector"] for item in valid_items])
    
    # Compute norms (lengths) of vectors
    u_norm = np.linalg.norm(u_vec)
    item_norms = np.linalg.norm(item_matrix, axis=1)
    
    # Avoid division by zero
    if u_norm == 0:
        return []
        
    # Find items with zero norm to avoid division by zero
    valid_mask = item_norms > 0
    if not np.any(valid_mask):
        return []
        
    # Calculate cosine similarity: (A dot B) / (||A|| * ||B||)
    # np.dot(item_matrix, u_vec) gives the dot product for each item
    dot_products = np.dot(item_matrix, u_vec)
    
    similarities = np.zeros(len(valid_items))
    similarities[valid_mask] = dot_products[valid_mask] / (u_norm * item_norms[valid_mask])
    
    # Get indices of the highest similarities
    # argsort sorts in ascending order, so we reverse it with [::-1]
    top_indices = np.argsort(similarities)[::-1][:top_k]
    
    # Map back to item IDs
    recommended_ids = [valid_items[i]["id"] for i in top_indices]
    
    return recommended_ids
