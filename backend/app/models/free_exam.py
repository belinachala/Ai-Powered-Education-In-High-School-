from __future__ import annotations
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class FreeExam(Base):
    __tablename__ = "free_exams"

    id = Column(Integer, primary_key=True) 
    category = Column(String(10), nullable=False)
    title = Column(Text, nullable=False)
    exam_type = Column(String(100), nullable=False)
    grade = Column(String(50), nullable=False)
    stream = Column(String(50), nullable=True)
    subject = Column(String(150), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    start_datetime = Column(DateTime(timezone=False), nullable=False)
    total_questions = Column(Integer, nullable=False)
    status = Column(String(30), nullable=False, default="pending_approval")

    # DB column name for who created the exam (matches your existing SQL)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # reviewer column in DB is 'reviewed_by_id' (keeps previous ALTER TABLE)
    reviewed_by_id = Column(
        "reviewed_by_id",
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # relationships: paired with User.created_free_exams / User.reviewed_free_exams
    creator = relationship(
        "User",
        back_populates="created_free_exams",
        foreign_keys=[created_by],
        lazy="joined",
    )

    reviewer = relationship(
        "User",
        back_populates="reviewed_free_exams",
        foreign_keys=[reviewed_by_id],
        lazy="joined",
    )

    questions = relationship(
        "Question",
        back_populates="exam",
        cascade="all, delete-orphan",
        order_by="Question.position",
    )