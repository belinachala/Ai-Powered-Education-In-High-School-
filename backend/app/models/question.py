from __future__ import annotations
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    exam_id = Column(Integer, ForeignKey("free_exams.id", ondelete="CASCADE"), nullable=False)
    client_id = Column(String(128), nullable=True)  # frontend-sent id for traceability
    type = Column(String(20), nullable=False)  # 'MCQ' | 'TRUE_FALSE' | 'BLANK' | 'MATCHING'
    text = Column(Text, nullable=True)
    
    # This is the column the API needs to look at!
    answer = Column(Text, nullable=True) 
    
    position = Column(Integer, nullable=False, default=0)

    exam = relationship("FreeExam", back_populates="questions")
    
    mcq_options = relationship(
        "MCQOption",
        back_populates="question",
        cascade="all, delete-orphan",
        order_by="MCQOption.key",
    )
    
    matching_pairs = relationship(
        "MatchingPair",
        back_populates="question",
        cascade="all, delete-orphan",
        order_by="MatchingPair.position",
    )