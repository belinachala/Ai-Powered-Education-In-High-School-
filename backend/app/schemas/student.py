from pydantic import BaseModel
from datetime import date
from typing import List, Optional
class StudentProfileResponse(BaseModel):
    id: int
    user_id: int
    student_id: str
    gender: str
    date_of_birth: date
    school_name: str
    region: str
    zone: str
    subcity: str
    woreda: str
    grade_levels: List[str] = []
    profile_picture_url: str | None

    class Config:
        from_attributes = True

 