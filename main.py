from fastapi import FastAPI
from contextlib import asynccontextmanager
import asyncio

from src.api.recommend import router as recommend_router
from src.config.rabbitmq import start_rabbitmq_consumer
from src.config.db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    try:
        await init_db()
    except Exception as e:
        print(f"[!] [MongoDB] Initialization failed: {e}")

    # Startup: Run the RabbitMQ consumer
    connection = await start_rabbitmq_consumer()
    yield
    # Shutdown: Close the connection
    if connection:
        await connection.close()
        print("[*] [RabbitMQ] Connection closed.")

app = FastAPI(title="Recommendation System", lifespan=lifespan)
app.include_router(recommend_router)


@app.get("/")
def health_check():
	return {"status": "ok", "message": "Recommendation system started"}