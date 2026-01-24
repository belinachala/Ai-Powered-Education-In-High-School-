from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TeachingImageResponse(BaseModel):
    id: int
    category: str
    stream: Optional[str] = None
    subject: str
    title: str
    file_path: str
    file_type: str
    user_id: int
    approval: str
    created_at: datetime

    class Config:
        from_attributes = True