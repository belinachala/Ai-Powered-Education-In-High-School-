from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate, AnnouncementOut, AnnouncementUpdate
from app.services.announcement_service import (
    create_announcement,
    get_announcements,
    get_announcement,
    update_announcement,
    get_announcements_for_student,
    get_announcements_for_student_with_reasons,
)
from app.db.session import get_db
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/announcements/", response_model=List[AnnouncementOut])
def list_announcements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_announcements(db, skip=skip, limit=limit)


@router.post("/announcements/", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
def create_new_announcement(payload: AnnouncementCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    created = create_announcement(db, payload, created_by_id=getattr(current_user, "id", None))
    return created


@router.patch("/announcements/{announcement_id}", response_model=AnnouncementOut)
def patch_announcement(announcement_id: int, payload: AnnouncementUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    announcement = get_announcement(db, announcement_id)
    if announcement is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Announcement not found")
    updated = update_announcement(db, announcement, payload)
    return updated


@router.get("/announcements/student", response_model=List[AnnouncementOut])
def list_student_announcements(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """
    Return announcements relevant for the authenticated student.
    """
    # Enforce student role if possible
    user_role = getattr(current_user, "role", None)
    if user_role is not None and user_role != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can access this endpoint")

    # Extract student fields: be permissive about shapes
    student_grade: Optional[str] = None
    student_specials: List[str] = []

    student_obj = getattr(current_user, "student", None)
    if student_obj is not None:
        student_grade = getattr(student_obj, "grade", None) or getattr(student_obj, "student_grade", None)
        sp = getattr(student_obj, "special_programs", None) or getattr(student_obj, "specials", None) or getattr(student_obj, "programs", None)
        if sp:
            try:
                student_specials = list(sp)
            except Exception:
                student_specials = [str(sp)]
    else:
        student_grade = getattr(current_user, "grade", None) or getattr(current_user, "student_grade", None)
        sp = getattr(current_user, "special_programs", None) or getattr(current_user, "specials", None)
        if sp:
            try:
                student_specials = list(sp)
            except Exception:
                student_specials = [str(sp)]

    if student_grade is not None:
        student_grade = str(student_grade)

    anns = get_announcements_for_student(db, student_grade=student_grade, student_specials=student_specials)
    return anns

@router.get("/announcements/teacher", response_model=List[AnnouncementOut])
def list_teacher_announcements(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """
    DEBUG: Return all active announcements for teachers (ignores grades for testing).
    """
    # Ensure teacher role
    user_role = getattr(current_user, "role", None)
    if user_role != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can access this endpoint")

    # Return all active announcements (ignore filtering by teacher grades for now)
    anns = db.query(Announcement).filter(Announcement.is_active == True).order_by(Announcement.created_at.desc()).all()
    return anns



@router.get("/announcements/student/debug")
def list_student_announcements_debug(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
) -> List[Dict[str, Any]]:
    """
    Debug endpoint — returns reasons why each active announcement was matched or rejected for the current student.

    Use this to inspect what's stored in the DB and how the student's profile looks to the backend.
    """
    # Ensure student role if present
    user_role = getattr(current_user, "role", None)
    if user_role is not None and user_role != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can access this endpoint")

    # extract student profile (same logic as list_student_announcements)
    student_grade: Optional[str] = None
    student_specials: List[str] = []

    student_obj = getattr(current_user, "student", None)
    if student_obj is not None:
        student_grade = getattr(student_obj, "grade", None) or getattr(student_obj, "student_grade", None)
        sp = getattr(student_obj, "special_programs", None) or getattr(student_obj, "specials", None) or getattr(student_obj, "programs", None)
        if sp:
            try:
                student_specials = list(sp)
            except Exception:
                student_specials = [str(sp)]
    else:
        student_grade = getattr(current_user, "grade", None) or getattr(current_user, "student_grade", None)
        sp = getattr(current_user, "special_programs", None) or getattr(current_user, "specials", None)
        if sp:
            try:
                student_specials = list(sp)
            except Exception:
                student_specials = [str(sp)]

    if student_grade is not None:
        student_grade = str(student_grade)

    debug_info = get_announcements_for_student_with_reasons(
        db,
        student_grade=student_grade,
        student_specials=student_specials,
        skip=skip,
        limit=limit,
    )

    # Also include a snapshot of the student's profile as seen by backend
    profile_snapshot = {
        "student_grade": student_grade,
        "student_specials": student_specials,
        "current_user_role": getattr(current_user, "role", None),
        "current_user_repr": {
            "id": getattr(current_user, "id", None),
            "username": getattr(current_user, "username", None),
            # do not leak sensitive info
        }
    }

    return {
        "profile": profile_snapshot,
        "announcements_debug": [
            {
                "id": item["announcement"].id,
                "title": item["announcement"].title,
                "is_active": item["announcement"].is_active,
                "created_at": item["announcement"].created_at,
                "matched": item["matched"],
                "reasons": item["reasons"],
                "target_grades_students": item["target_grades_students"],
                "target_special_students": item["target_special_students"],
            }
            for item in debug_info
        ]
    }
    