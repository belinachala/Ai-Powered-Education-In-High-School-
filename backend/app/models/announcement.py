from typing import List

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, func
from sqlalchemy.types import JSON

from app.db.base import Base


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    content = Column(Text, nullable=False)

    # store audience as a plain string: "all" | "teachers" | "students"
    target_audience = Column(String(20), nullable=False, default="all")

    # lists stored as JSON arrays so they map directly to/from frontend arrays
    target_grades_teachers = Column(JSON, nullable=False, default=list)  # e.g. ["9","10"]
    target_grades_students = Column(JSON, nullable=False, default=list)  # e.g. ["11","12"]
    target_special_students = Column(JSON, nullable=False, default=list)  # e.g. ["entrance","remedial"]

    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # optional creator relationship (adjust users table name if different)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    def __repr__(self) -> str:
        return f"<Announcement id={self.id} title={self.title!r}>"