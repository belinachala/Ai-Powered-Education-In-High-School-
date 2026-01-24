# app/models/user.py

from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import func

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    # ────────────────────────────────────────────────────────────────
    # Identification & Authentication
    # ────────────────────────────────────────────────────────────────
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    # ────────────────────────────────────────────────────────────────
    # Personal Information
    # ────────────────────────────────────────────────────────────────
    phone_number = Column(String(20), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    gender = Column(String(10), nullable=True)
    date_of_birth = Column(Date, nullable=True)

    # ────────────────────────────────────────────────────────────────
    # Role & Identification Numbers
    # ────────────────────────────────────────────────────────────────
    role = Column(String(20), nullable=False)  # teacher / student / schooldirector / admin

    teacher_id = Column(String(50), unique=True, nullable=True)
    student_id = Column(String(50), unique=True, nullable=True)
    director_id = Column(String(50), unique=True, nullable=True)

    # ────────────────────────────────────────────────────────────────
    # School & Location Information
    # ────────────────────────────────────────────────────────────────
    school_name = Column(String(150), nullable=True)
    region = Column(String(100), nullable=True)
    zone = Column(String(100), nullable=True)
    subcity = Column(String(100), nullable=True)
    woreda = Column(String(100), nullable=True)

    # ────────────────────────────────────────────────────────────────
    # Teacher-specific fields
    # ────────────────────────────────────────────────────────────────
    years_of_experience = Column(Integer, nullable=True)
    grade_levels = Column(ARRAY(String(50)), nullable=True)         # e.g. ['grade9', 'grade11']
    subjects_taught = Column(String(255), nullable=True)            # comma separated or JSON later?

    # ────────────────────────────────────────────────────────────────
    # Media & Status
    # ────────────────────────────────────────────────────────────────
    profile_picture_url = Column(String(255), nullable=True)

    # Timestamps (highly recommended)
    created_at = Column(Date, server_default=func.now(), nullable=False)
    updated_at = Column(
        Date,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # ────────────────────────────────────────────────────────────────
    # Relationships
    # ────────────────────────────────────────────────────────────────

    # Learning materials (documents) uploaded by this user
    learning_materials = relationship(
        "LearningMaterial",
        back_populates="uploader",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # Teaching images / diagrams uploaded by this user
    teaching_images = relationship(
        "TeachingImage",
        back_populates="uploader",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # Free exam relationships (you already had them — kept as is)
    created_free_exams = relationship(
        "FreeExam",
        back_populates="creator",
        foreign_keys="[FreeExam.created_by]",
        cascade="save-update, merge",
    )

    reviewed_free_exams = relationship(
        "FreeExam",
        back_populates="reviewer",
        foreign_keys="[FreeExam.reviewed_by_id]",
        cascade="save-update, merge",
    )

    def __repr__(self):
        return f"<User id={self.id} username={self.username} role={self.role}>"

    @property
    def full_name(self) -> str:
        return f"{self.first_name or ''} {self.last_name or ''}".strip() or self.username