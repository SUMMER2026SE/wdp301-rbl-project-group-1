from fastapi import FastAPI
from contextlib import asynccontextmanager
import asyncio

from src.api.recommend import router as recommend_router
from src.config.rabbitmq import start_rabbitmq_consumer
from src.config.db import init_db
from src.jobs.embedding_worker import embedding_worker_loop

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to PostgreSQL
    try:
        await init_db()
    except Exception as e:
        print(f"[!] [PostgreSQL] Initialization failed: {e}")

    # Startup: Run the RabbitMQ consumer
    connection = await start_rabbitmq_consumer()

    # Startup: Start the background embedding worker
    embedding_task = asyncio.create_task(embedding_worker_loop())

    yield
    # Shutdown: Close the connection
    if connection:
        await connection.close()
        print("[*] [RabbitMQ] Connection closed.")
    
    # Cancel background task
    embedding_task.cancel()

app = FastAPI(title="Recommendation System", lifespan=lifespan)
app.include_router(recommend_router)


@app.get("/")
def health_check():
	return {"status": "ok", "message": "Recommendation system started"}