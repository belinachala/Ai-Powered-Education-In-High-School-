from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Optional

class ExamAttemptResponse(BaseModel):
    id: int
    exam_id: int
    score: int
    total_questions: int
    percentage: float
    created_at: datetime

    class Config:
        from_attributes = True