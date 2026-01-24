from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate


# ---------------- Basic CRUD ----------------
def create_announcement(db: Session, payload: AnnouncementCreate, created_by_id: Optional[int] = None) -> Announcement:
    obj = Announcement(
        title=payload.title,
        content=payload.content,
        target_audience=payload.target_audience or "all",
        target_grades_teachers=payload.target_grades_teachers or [],
        target_grades_students=payload.target_grades_students or [],
        target_special_students=payload.target_special_students or [],
        is_active=payload.is_active if payload.is_active is not None else True,
        created_by_id=created_by_id,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_announcements(db: Session, skip: int = 0, limit: int = 100) -> List[Announcement]:
    """Return all announcements, newest first."""
    return db.query(Announcement).order_by(desc(Announcement.created_at)).offset(skip).limit(limit).all()


def get_announcement(db: Session, announcement_id: int) -> Optional[Announcement]:
    return db.query(Announcement).filter(Announcement.id == announcement_id).first()


def update_announcement(db: Session, announcement: Announcement, payload: AnnouncementUpdate) -> Announcement:
    data = payload.dict(exclude_unset=True)
    for field, value in data.items():
        setattr(announcement, field, value)
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement


# ---------------- Filtering Helpers ----------------
def _normalize_list_values(lst: Optional[List[Any]]) -> List[str]:
    if not lst:
        return []
    return [str(v).strip() for v in lst if v is not None and str(v).strip() != ""]


def _matches_grade(user_grade: Optional[str], target_grades: List[Any]) -> bool:
    tgt = _normalize_list_values(target_grades)
    if not tgt:
        return True
    if user_grade is None:
        return False
    return str(user_grade).strip() in tgt


def _matches_specials(user_specials: List[Any], target_specials: List[Any]) -> bool:
    tgt = set(_normalize_list_values(target_specials))
    if not tgt:
        return True
    user_set = set(_normalize_list_values(user_specials))
    return not tgt.isdisjoint(user_set)


# ---------------- Generic User Functions ----------------
def get_announcements_for_student(
    db: Session,
    student_grade: Optional[str] = None,
    student_specials: Optional[List[str]] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Announcement]:
    """DEBUG: Returns all active announcements regardless of grade/specials."""
    return db.query(Announcement).filter(Announcement.is_active == True).order_by(desc(Announcement.created_at)).offset(skip).limit(limit).all()


def get_announcements_for_student_with_reasons(
    db: Session,
    student_grade: Optional[str] = None,
    student_specials: Optional[List[str]] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Dict[str, Any]]:
    """DEBUG: Returns announcements with reasons (all matched = True)."""
    anns = db.query(Announcement).filter(Announcement.is_active == True).order_by(desc(Announcement.created_at)).offset(skip).limit(limit).all()
    out = []
    for ann in anns:
        out.append({
            "announcement": ann,
            "matched": True,
            "reasons": ["DEBUG: all announcements included"],
            "target_grades_students": _normalize_list_values(ann.target_grades_students),
            "target_special_students": _normalize_list_values(ann.target_special_students),
        })
    return out
