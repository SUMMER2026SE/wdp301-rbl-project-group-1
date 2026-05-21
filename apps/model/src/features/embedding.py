from typing import List, Optional
from sentence_transformers import SentenceTransformer

class EmbeddingService:
    _instance: Optional["EmbeddingService"] = None
    _model: Optional[SentenceTransformer] = None

    def __new__(cls) -> "EmbeddingService":
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
        return cls._instance

    def initialize(self) -> None:
        """Load the embedding model into memory."""
        if self._model is None:
            print("[*] [EmbeddingService] Loading embedding model (intfloat/multilingual-e5-small)...")
            # This is a synchronous call and will download the model if not cached.
            self._model = SentenceTransformer("intfloat/multilingual-e5-small")
            print("[*] [EmbeddingService] Model loaded successfully.")

    def generate_embedding(self, text: str) -> List[float]:
        """Generate a dense vector embedding for the given text."""
        if self._model is None:
            raise RuntimeError("Embedding model is not initialized. Call initialize() first.")
        
        # e5 models usually recommend prepending "passage: " or "query: " 
        # Since we are embedding items/users to be matched, "passage: " is appropriate.
        formatted_text = f"passage: {text}"
        
        # The encode method returns a numpy array, we convert it to a python list of floats
        vector = self._model.encode(formatted_text, normalize_embeddings=True)
        return vector.tolist()

# Singleton instance
embedding_service = EmbeddingService()
