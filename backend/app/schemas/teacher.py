# app/schema/teachers.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class TeacherProfile(BaseModel):
    id: int
    user_id: int
    teacher_id: Optional[str]
    gender: Optional[str]
    date_of_birth: Optional[date]
    school_name: Optional[str]
    region: Optional[str]
    zone: Optional[str]
    subcity: Optional[str]
    woreda: Optional[str]
    years_of_experience: Optional[int]

    subjects_taught: List[str] = []
    grade_levels: List[str] = []

    profile_picture_url: Optional[str]

    class Config:
        from_attributes = True
