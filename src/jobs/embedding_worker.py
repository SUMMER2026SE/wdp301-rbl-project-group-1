import asyncio
from typing import Dict, Any

from src.jobs.embedding_queue import get_embedding_queue
from src.features.embedding import embedding_service
from src.models.item import Item
from src.models.user import User

async def process_course_embedding(course_id: str) -> None:
    course = await Item.find_one(Item.id == course_id)
    if not course:
        print(f"[!] EmbeddingWorker: Course {course_id} not found.")
        return

    # Combine relevant features to create a rich semantic text representation
    title = course.basicInfo.title
    subject = course.features.get("subjectSlug", "")
    grade = course.features.get("gradeSlug", "")
    level = course.features.get("level", "")
    
    combined_text = f"Title: {title}. Subject: {subject}. Grade: {grade}. Level: {level}."
    
    print(f"[*] [EmbeddingWorker] Generating embedding for Course {course_id}...")
    
    # Run CPU-heavy embedding model in a separate thread
    vector = await asyncio.to_thread(embedding_service.generate_embedding, combined_text)
    
    course.embeddingVector = vector
    await course.save()
    
    print(f"[*] [EmbeddingWorker] Generated and saved embedding for Course {course_id}.")

async def process_user_embedding(user_id: str) -> None:
    user = await User.find_one(User.id == user_id)
    if not user:
        print(f"[!] EmbeddingWorker: User {user_id} not found.")
        return
        
    explicit = user.recommendation.explicitPreferences if user.recommendation else None
    if not explicit:
        return
        
    subjects = ", ".join(explicit.subjectSlugs)
    grades = ", ".join(explicit.gradeSlugs)
    
    combined_text = f"Interested subjects: {subjects}. Interested grades: {grades}."
    
    print(f"[*] [EmbeddingWorker] Generating embedding for User {user_id}...")
    
    # Run CPU-heavy embedding model in a separate thread
    vector = await asyncio.to_thread(embedding_service.generate_embedding, combined_text)
    
    user.recommendation.embeddingVector = vector
    await user.save()
    
    print(f"[*] [EmbeddingWorker] Generated and saved embedding for User {user_id}.")

async def embedding_worker_loop() -> None:
    """Background worker that continuously processes embedding tasks from the queue."""
    print("[*] [EmbeddingWorker] Started background worker.")
    queue = get_embedding_queue()

    # Initialize the model once the worker starts
    # Since loading might be slow, we do it in a thread
    await asyncio.to_thread(embedding_service.initialize)

    while True:
        task: Dict[str, Any] | None = None
        try:
            task = await queue.get()
            task_type = task.get("type")
            entity_id = task.get("id")

            if task_type == "COURSE":
                await process_course_embedding(entity_id)
            elif task_type == "USER":
                await process_user_embedding(entity_id)
            else:
                print(f"[!] EmbeddingWorker: Unknown task type {task_type}")

        except asyncio.CancelledError:
            # App is shutting down — exit gracefully without calling task_done
            print("[*] [EmbeddingWorker] Shutdown signal received. Stopping worker.")
            break
        except Exception as e:
            print(f"[!] [EmbeddingWorker] Error processing task: {e}")
        finally:
            # Only call task_done if we actually fetched a task from the queue
            if task is not None:
                queue.task_done()

