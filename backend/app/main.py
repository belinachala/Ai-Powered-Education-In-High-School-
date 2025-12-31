from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import your API routers
from app.api import auth
from app.api import directors
from app.api import students
from app.api import teachers
from app.api import subject_upload  # <-- THIS WAS MISSING! Now added

app = FastAPI(title="School Management API")

# CORS Middleware (for frontend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite/React default port
        "http://127.0.0.1:5173",
        # Add your production frontend URL later if needed
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
app.include_router(subject_upload.router)  # <-- NOW INCLUDED!

# Serve uploaded files statically
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")