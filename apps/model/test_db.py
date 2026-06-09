import asyncio
from src.config.db import init_db

async def main():
    try:
        await init_db()
    except Exception as e:
        print("EXCEPTION:", type(e).__name__, e)

asyncio.run(main())
