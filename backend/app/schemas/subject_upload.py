from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal  # ← Added Literal here

class LearningMaterialBase(BaseModel):
    category: str
    stream: Optional[str] = None
    subject: str
    file_type: str
    approval: str = "pending"

class LearningMaterialCreate(LearningMaterialBase):
    pass  # No additional fields for create

class LearningMaterialResponse(BaseModel):
    id: int
    category: str
    stream: Optional[str] = None
    subject: str
    file_path: str
    file_type: str
    user_id: int              
    approval: str
    created_at: datetime

    class Config:
        from_attributes = True  # Required for ORM mode


# ==================== NEW MODEL ADDED BELOW ====================

class ApprovalUpdate(BaseModel):
    approval: Literal["approved", "rejected"]