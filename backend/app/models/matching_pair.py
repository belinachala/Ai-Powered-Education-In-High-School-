from __future__ import annotations
from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class MatchingPair(Base):
    __tablename__ = "matching_pairs"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    position = Column(Integer, nullable=False, default=0)  # 0-based index
    left_text = Column(Text, nullable=False)
    right_text = Column(Text, nullable=False)

    question = relationship("Question", back_populates="matching_pairs")