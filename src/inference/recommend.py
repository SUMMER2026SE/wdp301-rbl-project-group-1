from pathlib import Path
import sys

ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
	sys.path.insert(0, str(ROOT_DIR))

from src.data.loader import load_data
from src.algorithms.collaborative import CollaborativeFiltering
from src.config.db import init_db
import asyncio

async def main():
    await init_db()
    df = await load_data()

    model = CollaborativeFiltering()
    model.fit(df)

    if df.empty:
        print("[]")
    else:
        print(model.recommend(user_id="usr_student_01"))

if __name__ == "__main__":
    asyncio.run(main())