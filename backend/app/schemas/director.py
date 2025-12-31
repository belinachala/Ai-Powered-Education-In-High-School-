from pydantic import BaseModel
from datetime import date
from typing import List, Optional
class DirectorProfileResponse(BaseModel):
    id: int
    user_id: int
    director_id: str
    gender: str
    date_of_birth: date
    school_name: str
    region: str
    zone: str
    subcity: str
    woreda: str
    years_of_experience: int
    profile_picture_url: str | None

    class Config:
        from_attributes = True
