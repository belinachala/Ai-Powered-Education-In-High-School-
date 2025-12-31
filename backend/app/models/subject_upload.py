from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.user import User  # Import User model (since teachers are in users table)


class LearningMaterial(Base):
    __tablename__ = "learning_material"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)          # e.g., 'grade9', 'entrance'
    stream = Column(String, nullable=True)            # e.g., 'natural', 'social' (nullable for grade9/10)
    subject = Column(String, nullable=False)           # e.g., 'Grade 11 Physics'
    file_path = Column(String, nullable=False)         # Full path: uploads/teachers/grade11_natural/...
    file_type = Column(String, nullable=False)         # e.g., 'pdf', 'docx'
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Links to users.id
    approval = Column(String, default="pending", nullable=False)       # 'pending', 'approved', 'rejected'
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relationship back to User (teacher who uploaded)
    uploader = relationship("User", back_populates="learning_materials")