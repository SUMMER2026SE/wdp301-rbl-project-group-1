import asyncio
import os
import json
# pyrefly: ignore [missing-import]
import aio_pika
from dotenv import load_dotenv

load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
QUEUE_NAME = "edura_events_queue"

async def process_message(message: aio_pika.IncomingMessage):
    async with message.process():
        body = message.body.decode()
        try:
            # Parse the incoming NestJS microservice message format.
            # NestJS typically sends data like: {"pattern": "event_name", "data": {...}}
            data = json.loads(body)
            print(f"[*] [RabbitMQ] Received message: {data}")
            
            # Example logic to route messages based on pattern
            pattern = data.get("pattern")
            payload = data.get("data")
            
            if pattern == "enrollment_created":
                print(f"[*] Processing new enrollment: {payload}")
                # Save to DB or trigger model training
            else:
                print(f"[*] Unknown pattern: {pattern}")
                
        except json.JSONDecodeError:
            print(f"[!] [RabbitMQ] Failed to parse JSON: {body}")
        except Exception as e:
            print(f"[!] [RabbitMQ] Error processing message: {e}")

async def start_rabbitmq_consumer():
    if not RABBITMQ_URL:
        print("[!] [RabbitMQ] RABBITMQ_URL is not set. Skipping RabbitMQ connection.")
        return None

    while True:
        try:
            # connect_robust will automatically reconnect if connection is lost
            connection = await aio_pika.connect_robust(RABBITMQ_URL)
            channel = await connection.channel()

            # Declare queue to match NestJS
            queue = await channel.declare_queue(QUEUE_NAME, durable=True)

            print(f"[*] [RabbitMQ] Connected successfully. Waiting for messages on '{QUEUE_NAME}'")

            # Start consuming
            await queue.consume(process_message)
            
            return connection
        except Exception as e:
            print(f"[!] [RabbitMQ] Connection failed, retrying in 5 seconds... Error: {e}")
            await asyncio.sleep(5)
