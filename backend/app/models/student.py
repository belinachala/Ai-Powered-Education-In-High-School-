from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from sqlalchemy.dialects.postgresql import ARRAY
class StudentProfile(Base):
    __tablename__ = "student_profiles"

 
    student_id = Column(String(50), unique=True, nullable=False)
    gender = Column(String(10), nullable=False)
    date_of_birth = Column(Date, nullable=False)

    school_name = Column(String(150), nullable=False)
    region = Column(String(100), nullable=False)
    zone = Column(String(100), nullable=False)
    subcity = Column(String(100), nullable=False)
    woreda = Column(String(50), nullable=False)
    grade_levels = Column(ARRAY(String(50)), nullable=True)

    profile_picture_url = Column(String(255), nullable=True)

    # Relationship to User
    user = relationship("User", back_populates="student_profile")
