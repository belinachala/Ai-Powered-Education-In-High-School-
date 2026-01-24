from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.user import User

class TeachingImage(Base):
    __tablename__ = "teaching_images"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    stream = Column(String, nullable=True)
    subject = Column(String, nullable=False)
    title = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    approval = Column(String, default="pending", nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    uploader = relationship("User", back_populates="teaching_images")