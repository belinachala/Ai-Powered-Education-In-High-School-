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
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
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
    
    # ================================
# GET ALL TEACHERS (for director)
# ================================
@router.get("/teachers")
def get_all_teachers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # ✅ Role check: only directors
    if current_user.role != "schooldirector":
        raise HTTPException(status_code=403, detail="Only directors can access teachers list")

    teachers = db.query(User).filter(User.role == "teacher").all()
    if not teachers:
        return {"message": "No teachers found", "teachers": []}

    # Convert to JSON-friendly dict
    teachers_list = []
    for t in teachers:
        teachers_list.append({
            "id": t.id,
            "username": t.username,
            "first_name": t.first_name,
            "last_name": t.last_name,
            "email": t.email,
            "phone_number": t.phone_number,
            "teacher_id": t.teacher_id,
            "gender": t.gender,
            "date_of_birth": t.date_of_birth,
            "school_name": t.school_name,
            "region": t.region,
            "zone": t.zone,
            "subcity": t.subcity,
            "woreda": t.woreda,
            "years_of_experience": t.years_of_experience,
            "subjects_taught": t.subjects_taught.split(",") if t.subjects_taught else [],
            "grade_levels": t.grade_levels if t.grade_levels else [],
            "profile_picture_url": t.profile_picture_url
        })

    return {"teachers": teachers_list}

# ---------------------------
# GET ALL STUDENTS
# ---------------------------
@router.get("/students")
def get_all_students(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "schooldirector":
        raise HTTPException(status_code=403, detail="Only directors can access students")

    students = db.query(User).filter(User.role == "student").all()

    result = []
    for s in students:
        result.append({
            "id": s.id,
            "username": s.username,
            "first_name": s.first_name,
            "last_name": s.last_name,
            "email": s.email,
            "phone_number": s.phone_number,
            "student_id": s.student_id,
            "gender": s.gender,
            "date_of_birth": s.date_of_birth,
            "school_name": s.school_name,
            "region": s.region,
            "zone": s.zone,
            "subcity": s.subcity,
            "woreda": s.woreda,
            "grade_levels": s.grade_levels,
            "profile_picture_url": s.profile_picture_url
        })
    return {"students": result}