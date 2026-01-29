from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Import your database components
from app.db.session import engine
from app.db.base import Base  

# 1. Force load models to ensure Base knows about them for create_all
import app.models.user           # Table: users
import app.models.free_exam      # Table: free_exams
import app.models.question       # Table: questions
import app.models.exam_attempt   # Table: exam_attempts (Crucial for submission)

# 2. Create tables if they don't exist
# Note: In production, it's better to use Alembic migrations
Base.metadata.create_all(bind=engine)

# 3. Import your API routers
from app.api import (
    auth, 
    directors, 
    students, 
    teachers, 
    subject_upload, 
    free_exams, 
    announcements, 
    image_upload
)

app = FastAPI(title="School Management API")

# 4. CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Static Files (Ensure the 'uploads' folder exists)
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"message": "EduTena School Management Developed by Belina"}

# 6. Include Routers
# Since your free_exams.py router ALREADY has prefix="/free-exams", 
# do NOT add a prefix here.
app.include_router(auth.router)
app.include_router(directors.router)
app.include_router(students.router)
app.include_router(teachers.router)
app.include_router(subject_upload.router)
app.include_router(free_exams.router)  # This registers /free-exams/...
app.include_router(announcements.router)
app.include_router(image_upload.router)