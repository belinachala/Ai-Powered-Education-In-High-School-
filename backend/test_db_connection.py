from sqlalchemy import create_engine
from app.core.config import settings

DATABASE_URL = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}" \
               f"@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"

try:
    engine = create_engine(DATABASE_URL)
    conn = engine.connect()
    print("✅ Successfully connected to PostgreSQL")
    conn.close()
except Exception as e:
    print("❌ Failed to connect to PostgreSQL")
    print(e)
