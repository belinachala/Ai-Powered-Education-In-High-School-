from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from app.db.base import Base
from sqlalchemy.dialects.postgresql import ARRAY


class User(Base):
    __tablename__ = "users"

    # existing columns
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone_number = Column(String(20), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)

    teacher_id = Column(String(50), unique=True, nullable=True)
    student_id = Column(String(50), unique=True, nullable=True)
    director_id = Column(String(50), unique=True, nullable=True)
    gender = Column(String(10), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    school_name = Column(String(150), nullable=True)
    region = Column(String(100), nullable=True)
    zone = Column(String(100), nullable=True)
    subcity = Column(String(100), nullable=True)
    woreda = Column(String(100), nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    profile_picture_url = Column(String(255), nullable=True)

    grade_levels = Column(ARRAY(String(50)), nullable=True)
    subjects_taught = Column(String(255), nullable=True)

    # Relationship to learning materials (existing in your project)
    learning_materials = relationship("LearningMaterial", back_populates="uploader")

    # --- FreeExam relationships (canonical pair) ---
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