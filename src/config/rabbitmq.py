import asyncio
import os
import json

# pyrefly: ignore [missing-import]
import aio_pika
from dotenv import load_dotenv

from src.handlers import HANDLER_REGISTRY

load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
QUEUE_NAME = "edura_events_queue"


async def process_message(message: aio_pika.IncomingMessage) -> None:
    async with message.process():
        body = message.body.decode()
        try:
            # NestJS sends: {"pattern": "event_name", "data": {...}}
            data = json.loads(body)
            pattern: str = data.get("pattern", "")
            payload: dict = data.get("data", {})

            print(f"[*] [RabbitMQ] Received: pattern='{pattern}'")

            handler = HANDLER_REGISTRY.get(pattern)
            if handler:
                try:
                    await handler.handle(payload)
                except Exception as e:
                    print(f"[!] Handler error for pattern '{pattern}': {e}")
            else:
                print(f"[!] No handler registered for pattern: '{pattern}'")

        except json.JSONDecodeError:
            print(f"[!] [RabbitMQ] Failed to parse JSON: {body}")
        except Exception as e:
            print(f"[!] [RabbitMQ] Unexpected error: {e}")


async def start_rabbitmq_consumer():
    if not RABBITMQ_URL:
        print("[!] [RabbitMQ] RABBITMQ_URL is not set. Skipping RabbitMQ connection.")
        return None

    while True:
        try:
            # connect_robust auto-reconnects on connection loss
            connection = await aio_pika.connect_robust(RABBITMQ_URL)
            channel = await connection.channel()
            queue = await channel.declare_queue(QUEUE_NAME, durable=True)

            print(f"[*] [RabbitMQ] Connected successfully. Waiting for messages on '{QUEUE_NAME}'")

            await queue.consume(process_message)
            return connection
        except Exception as e:
            print(f"[!] [RabbitMQ] Connection failed, retrying in 5s... Error: {e}")
            await asyncio.sleep(5)
