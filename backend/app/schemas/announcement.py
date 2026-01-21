from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class AnnouncementBase(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    target_audience: Optional[str] = "all"
    target_grades_teachers: List[str] = Field(default_factory=list)
    target_grades_students: List[str] = Field(default_factory=list)
    target_special_students: List[str] = Field(default_factory=list)
    is_active: Optional[bool] = True


class AnnouncementCreate(AnnouncementBase):
    pass


class AnnouncementUpdate(BaseModel):
    # all optional for partial updates (PATCH)
    title: Optional[str] = None
    content: Optional[str] = None
    target_audience: Optional[str] = None
    target_grades_teachers: Optional[List[str]] = None
    target_grades_students: Optional[List[str]] = None
    target_special_students: Optional[List[str]] = None
    is_active: Optional[bool] = None


class AnnouncementOut(AnnouncementBase):
    id: int
    created_at: datetime
    created_by_id: Optional[int] = None

    class Config:
        orm_mode = True