from __future__ import annotations
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class MCQOption(Base):
    __tablename__ = "mcq_options"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    key = Column(String(1), nullable=False)  # 'A','B','C','D'
    text = Column(Text, nullable=False)

    question = relationship("Question", back_populates="mcq_options")