from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class DirectorProfile(Base):
    __tablename__ = "director_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    director_id = Column(String(50), unique=True, nullable=False)
    gender = Column(String(10), nullable=False)
    date_of_birth = Column(Date, nullable=False)

    school_name = Column(String(150), nullable=False)
    region = Column(String(100), nullable=False)
    zone = Column(String(100), nullable=False)
    subcity = Column(String(100), nullable=False)
    woreda = Column(String(50), nullable=False)

    years_of_experience = Column(Integer, nullable=False)
    profile_picture_url = Column(String(255), nullable=True)

    user = relationship("User", back_populates="director_profile")
