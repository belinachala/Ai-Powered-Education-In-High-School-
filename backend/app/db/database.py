# app/db/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# PostgreSQL engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True  # Use SQLAlchemy 2.0 style
)

# Session Local
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True  # Use 2.0 style
)

# Base class for models
Base = declarative_base()

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
