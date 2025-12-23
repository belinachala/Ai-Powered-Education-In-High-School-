from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, directors

app = FastAPI(title="School Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(directors.router)


@app.get("/")
def root():
    return {"message": "School Management API is running"}
