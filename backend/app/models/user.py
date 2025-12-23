from sqlalchemy import Column, Integer, String, Date
from app.db.base import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Registration & Login (DO NOT CHANGE)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone_number = Column(String(20), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)

    # Director profile fields (same table)
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
