from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os
import pandas as pd

load_dotenv()

DATABASE_URL = os.getenv("PRISMA_URL")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

def query(sql: str, params=None):
    with engine.connect() as conn:
        print("[DB] Connected successfully")
        return pd.read_sql(text(sql), conn, params=params or {})


def execute(sql: str, params=None):
    with engine.begin() as conn:
        print("[DB] Connected successfully")
        conn.execute(text(sql), params or {})


if __name__ == "__main__":
    with engine.connect():
        print("[DB] Connected successfully")