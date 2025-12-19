# app/db/models.py
from sqlalchemy import Column, String, Integer, Date, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(20), nullable=False)  # 'schooldirector', 'teacher', 'student'
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone_number = Column(String(20), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

    # Common profile fields
    gender = Column(String(10), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    profile_picture = Column(String, nullable=True)

    # Director-specific fields
    director_id = Column(String(50), unique=True, nullable=True)
    school_name = Column(String(255), nullable=True)
    region = Column(String(100), nullable=True)
    subcity = Column(String(100), nullable=True)
    woreda = Column(String(100), nullable=True)
    zone = Column(String(100), nullable=True)
    years_of_experience = Column(Integer, nullable=True)

    # Teacher-specific fields
    teacher_id = Column(String(50), unique=True, nullable=True)
    subjects_taught = Column(ARRAY(String), nullable=True)
    grade_levels = Column(ARRAY(String), nullable=True)

    # Student-specific fields
    student_id = Column(String(50), unique=True, nullable=True)
    grade_level = Column(String(10), nullable=True)
