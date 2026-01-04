from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
import os

from app.models.user import User
from app.db.session import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/teachers", tags=["Teachers"])

# =====================================
# Helpers
# =====================================
def is_filled(value):
    if value is None:
        return False
    return str(value).strip() != ""


# =====================================
# GET teacher profile
# =====================================
@router.get("/me/profile")
def get_teacher_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers allowed")

    required_fields = [
        "teacher_id",
        "gender",
        "date_of_birth",
        "school_name",
        "region",
        "zone",
        "subcity",
        "woreda",
        "years_of_experience",
        "subjects_taught",
        "grade_levels",
    ]

    profile_completed = all(
        is_filled(getattr(current_user, field))
        for field in required_fields
    )

    return {
    "first_name": current_user.first_name,
    "last_name": current_user.last_name,
    "teacher_id": current_user.teacher_id,
    "gender": current_user.gender,
    "date_of_birth": current_user.date_of_birth,
    "school_name": current_user.school_name,
    "region": current_user.region,
    "zone": current_user.zone,
    "subcity": current_user.subcity,
    "woreda": current_user.woreda,
    "years_of_experience": current_user.years_of_experience,
    "subjects_taught": current_user.subjects_taught,
    "grade_levels": current_user.grade_levels,
    "profile_picture_url": current_user.profile_picture_url,
    "profile_completed": profile_completed,
}


# =====================================
# POST teacher profile (FORM DATA)
# =====================================
@router.post("/me/profile")
def update_teacher_profile(
    teacher_id: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    date_of_birth: Optional[str] = Form(None),
    school_name: Optional[str] = Form(None),
    region: Optional[str] = Form(None),
    zone: Optional[str] = Form(None),
    subcity: Optional[str] = Form(None),
    woreda: Optional[str] = Form(None),
    years_of_experience: Optional[int] = Form(None),
    subjects_taught: Optional[str] = Form(None),
    grade_level: Optional[str] = Form(None),  # single grade
    profile_picture: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers allowed")

    if teacher_id is not None:
        current_user.teacher_id = teacher_id
    if gender is not None:
        current_user.gender = gender
    if date_of_birth is not None:
        current_user.date_of_birth = date_of_birth
    if school_name is not None:
        current_user.school_name = school_name
    if region is not None:
        current_user.region = region
    if zone is not None:
        current_user.zone = zone
    if subcity is not None:
        current_user.subcity = subcity
    if woreda is not None:
        current_user.woreda = woreda
    if years_of_experience is not None:
        current_user.years_of_experience = years_of_experience
    if subjects_taught is not None:
        current_user.subjects_taught = subjects_taught
    if grade_level is not None:
        current_user.grade_levels = grade_level  # single grade

    if profile_picture:
        upload_dir = "uploads/teachers"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, f"{current_user.id}_{profile_picture.filename}")
        with open(file_path, "wb") as f:
            f.write(profile_picture.file.read())
        current_user.profile_picture_url = file_path

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Teacher profile updated successfully",
        "profile_completed": True
    }


# =====================================
# GET STUDENTS (Teacher Access - Single grade)
# =====================================
@router.get("/students")
def get_students_for_teacher(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access students")

    if not current_user.grade_levels:
        raise HTTPException(
            status_code=400,
            detail="Teacher has no assigned grade level"
        )

    # Filter students whose grade matches the teacher's grade
    students = db.query(User).filter(
        User.role == "student",
        User.grade_levels == current_user.grade_levels
    ).all()

    # Prepare response
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
            "profile_picture_url": s.profile_picture_url,
        })

    return {
        "teacher_grade": current_user.grade_levels,
        "students": result
    }
