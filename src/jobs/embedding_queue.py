import asyncio
from typing import Dict, Any

# Internal queue for embedding tasks
# Elements should be dictionaries like {"type": "COURSE", "id": "course_123"}
_embedding_queue: asyncio.Queue[Dict[str, Any]] = asyncio.Queue()

def get_embedding_queue() -> asyncio.Queue[Dict[str, Any]]:
    """Returns the internal embedding queue."""
    return _embedding_queue

async def push_to_embedding_queue(task: Dict[str, Any]) -> None:
    """Push a task to the background embedding queue."""
    await _embedding_queue.put(task)
    print(f"[*] Added to embedding queue: {task}")
