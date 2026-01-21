from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import your API routers
from app.api import auth
from app.api import directors
from app.api import students
from app.api import teachers
from app.api import subject_upload
from app.api import free_exams          # ← Added here (plural!)
from app.api import announcements      # ← announcements router (new)
from app.api.free_exams import router as free_exams_router 
import app.models.announcement  # noqa: F401

app = FastAPI(title="School Management API")

# CORS Middleware (for frontend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite/React default port
        "http://127.0.0.1:5173",
        # Add your production frontend URL later if needed
        # Example: "https://your-frontend-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def root():
    return {"message": "EduTena School Management Developed by Belina"}

# Include all API routers
app.include_router(auth.router)
app.include_router(directors.router)
app.include_router(students.router)
app.include_router(teachers.router)
app.include_router(subject_upload.router)
app.include_router(free_exams.router)       # ← Added here!
app.include_router(announcements.router)   # ← Announcements endpoints: /announcements/

# Serve uploaded files statically
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads") 
