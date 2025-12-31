from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import date
import shutil
import os

from app.models.user import User
from app.db.session import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/directors", tags=["Directors"])


# ================================
# COMPLETE DIRECTOR PROFILE (POST)
# ================================
@router.post("/me/profile")
def complete_director_profile(
    director_id: str = Form(...),
    gender: str = Form(...),
    date_of_birth: date = Form(...),
    school_name: str = Form(...),
    region: str = Form(...),
    subcity: str = Form(...),
    woreda: str = Form(...),
    zone: str = Form(...),
    years_of_experience: int = Form(...),
    profile_picture: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # ✅ Role protection
    if current_user.role != "schooldirector":
        raise HTTPException(status_code=403, detail="Only directors can complete this profile")

    # 🚫 Prevent re-completing profile
    if current_user.director_id is not None:
        raise HTTPException(
            status_code=400,
            detail="Profile already completed"
        )

    # ✅ Save profile data
    current_user.director_id = director_id
    current_user.gender = gender
    current_user.date_of_birth = date_of_birth
    current_user.school_name = school_name
    current_user.region = region
    current_user.subcity = subcity
    current_user.woreda = woreda
    current_user.zone = zone
    current_user.years_of_experience = years_of_experience

    # 📷 Save profile picture file (optional)
    if profile_picture:
        upload_dir = "uploads/directors"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, profile_picture.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_picture.file, buffer)
        current_user.profile_picture_url = file_path

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Director profile completed successfully",
        "profile_completed": True
    }


# ================================
# GET DIRECTOR PROFILE STATUS
# ================================
@router.get("/me/profile")
def get_director_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "schooldirector":
        raise HTTPException(status_code=403, detail="Only directors can access this profile")

    return {
        "profile_completed": current_user.director_id is not None,
        "director_id": current_user.director_id,
        "gender": current_user.gender,
        "date_of_birth": current_user.date_of_birth,
        "school_name": current_user.school_name,
        "region": current_user.region,
        "subcity": current_user.subcity,
        "woreda": current_user.woreda,
        "zone": current_user.zone,
        "years_of_experience": current_user.years_of_experience,
        "profile_picture_url": current_user.profile_picture_url
    }


# ================================
# UPDATE DIRECTOR PROFILE (PUT) - NEWLY ADDED
# ================================
@router.put("/me/profile")
def update_director_profile(
    director_id: str | None = Form(None),
    gender: str | None = Form(None),
    date_of_birth: date | None = Form(None),
    school_name: str | None = Form(None),
    region: str | None = Form(None),
    subcity: str | None = Form(None),
    woreda: str | None = Form(None),
    zone: str | None = Form(None),
    years_of_experience: int | None = Form(None),
    profile_picture: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # ✅ Role protection
    if current_user.role != "schooldirector":
        raise HTTPException(status_code=403, detail="Only directors can update this profile")

    # ✅ Profile must already exist
    if current_user.director_id is None:
        raise HTTPException(status_code=400, detail="Complete profile first before updating")

    # ✅ Update only provided fields
    if director_id is not None:
        current_user.director_id = director_id
    if gender is not None:
        current_user.gender = gender
    if date_of_birth is not None:
        current_user.date_of_birth = date_of_birth
    if school_name is not None:
        current_user.school_name = school_name
    if region is not None:
        current_user.region = region
    if subcity is not None:
        current_user.subcity = subcity
    if woreda is not None:
        current_user.woreda = woreda
    if zone is not None:
        current_user.zone = zone
    if years_of_experience is not None:
        current_user.years_of_experience = years_of_experience

    # 📷 Update profile picture if provided
    if profile_picture:
        upload_dir = "uploads/directors"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, profile_picture.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_picture.file, buffer)
        current_user.profile_picture_url = file_path

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Director profile updated successfully"
    }