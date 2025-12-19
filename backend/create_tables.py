# create_tables.py
from app.db.database import engine, Base
from app.db import models

# This will create all tables defined in models.py
Base.metadata.create_all(bind=engine)

print("✅ Users table (with director, teacher, student) created successfully!")
