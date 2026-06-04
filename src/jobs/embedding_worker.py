"""
embedding_worker.py
Background worker that consumes from the in-memory embedding queue
and generates/stores 384-dim vectors for TutorItems and Users via
intfloat/multilingual-e5-small (sentence-transformers).
"""
import asyncio
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm.attributes import flag_modified

from src.jobs.embedding_queue import get_embedding_queue
from src.features.embedding import embedding_service
from src.features.tutor_features import build_tutor_feature_text, build_user_embedding_text
from src.models.tutor_item import TutorItem
from src.models.user import User
from src.config.db import get_session_maker


# ---------------------------------------------------------------------------
# Per-entity embedding processors
# ---------------------------------------------------------------------------

async def process_tutor_embedding(tutor_id: str) -> None:
    """
    Generate and persist an embedding vector for a TutorItem.
    Combines specialization + subjects + grades into a multilingual text
    and encodes with intfloat/multilingual-e5-small.
    """
    async_session = get_session_maker()
    async with async_session() as session:
        result = await session.execute(select(TutorItem).filter_by(id=tutor_id))
        tutor = result.scalar_one_or_none()

        if not tutor:
            print(f"[!] [EmbeddingWorker] TutorItem {tutor_id} not found — skipping.")
            return

        text = build_tutor_feature_text(
            basic_info=tutor.basic_info or {},
            features=tutor.features or {},
        )

        print(f"[*] [EmbeddingWorker] Embedding tutor {tutor_id}: \"{text[:80]}...\"")

        # CPU-heavy call → run in thread to avoid blocking the event loop
        vector = await asyncio.to_thread(embedding_service.generate_embedding, text)

        tutor.embedding_vector = vector
        await session.commit()

        print(f"[*] [EmbeddingWorker] Saved embedding for TutorItem {tutor_id}.")


async def process_user_embedding(user_id: str) -> None:
    """
    Generate and persist an embedding vector for a User based on their
    explicit subject/grade preferences stored in User.recommendation JSONB.

    Skips if explicit preferences are not set (no text to embed).
    """
    async_session = get_session_maker()
    async with async_session() as session:
        result = await session.execute(select(User).filter_by(id=user_id))
        user = result.scalar_one_or_none()

        if not user:
            print(f"[!] [EmbeddingWorker] User {user_id} not found — skipping.")
            return

        rec_data = dict(user.recommendation) if user.recommendation else {}
        explicit = rec_data.get("explicitPreferences", {})
        subject_slugs = explicit.get("subjectSlugs", [])
        grade_slugs = explicit.get("gradeSlugs", [])

        text = build_user_embedding_text(subject_slugs, grade_slugs)
        if not text:
            print(f"[*] [EmbeddingWorker] User {user_id} has no preferences — skipping embed.")
            return

        print(f"[*] [EmbeddingWorker] Embedding user {user_id}: \"{text[:80]}\"")

        vector = await asyncio.to_thread(embedding_service.generate_embedding, text)

        rec_data["embeddingVector"] = list(vector)
        user.recommendation = rec_data
        flag_modified(user, "recommendation")
        await session.commit()

        print(f"[*] [EmbeddingWorker] Saved embedding for User {user_id}.")


# ---------------------------------------------------------------------------
# Background worker loop
# ---------------------------------------------------------------------------

async def embedding_worker_loop() -> None:
    """
    Infinite background loop that drains the in-memory embedding queue.
    Supported task types:
        {"type": "TUTOR", "id": "<tutor_id>"}
        {"type": "USER",  "id": "<user_id>"}

    Loads the sentence-transformer model once on startup.
    Handles shutdown gracefully via asyncio.CancelledError.
    """
    print("[*] [EmbeddingWorker] Starting background worker...")
    queue = get_embedding_queue()

    # Load model once (downloads on first run, cached after)
    await asyncio.to_thread(embedding_service.initialize)
    print("[*] [EmbeddingWorker] Embedding model ready.")

    while True:
        task: dict[str, Any] | None = None
        try:
            task = await queue.get()
            task_type = task.get("type")
            entity_id = task.get("id")

            if task_type == "TUTOR":
                await process_tutor_embedding(entity_id)
            elif task_type == "USER":
                await process_user_embedding(entity_id)
            else:
                print(f"[!] [EmbeddingWorker] Unknown task type: {task_type!r} — ignoring.")

        except asyncio.CancelledError:
            print("[*] [EmbeddingWorker] Shutdown signal received — stopping.")
            break
        except Exception as exc:
            print(f"[!] [EmbeddingWorker] Error processing task {task}: {exc}")
        finally:
            if task is not None:
                queue.task_done()
