from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate


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


def _normalize_list_values(lst: Optional[List[Any]]) -> List[str]:
    """
    Convert list elements to stripped strings (handles numbers, booleans, None).
    """
    if not lst:
        return []
    out: List[str] = []
    for v in lst:
        if v is None:
            continue
        s = str(v).strip()
        if s != "":
            out.append(s)
    return out


def _matches_grade(student_grade: Optional[str], tgt_grades: List[Any]) -> bool:
    """
    Determine if student_grade matches announcement target grades.
    Empty tgt_grades means announcement targets all regular students.
    """
    tgt = _normalize_list_values(tgt_grades)
    if not tgt:
        return True
    if student_grade is None:
        return False
    return str(student_grade).strip() in tgt


def _matches_specials(student_specials: List[Any], tgt_specials: List[Any]) -> bool:
    """
    If tgt_specials empty => no special targeting (OK).
    Otherwise require at least one overlap.
    """
    tgt = set(_normalize_list_values(tgt_specials))
    if not tgt:
        return True
    student_set = set(_normalize_list_values(student_specials))
    return not tgt.isdisjoint(student_set)


def get_announcements_for_student(
    db: Session,
    student_grade: Optional[str],
    student_specials: Optional[List[str]] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Announcement]:
    """
    Returns active announcements that are targeted to students and match the student's grade
    and/or special programs.

    Matching is robust to numeric vs string grade types and whitespace.
    """
    student_specials = student_specials or []

    q = db.query(Announcement).filter(
        Announcement.is_active == True,
        Announcement.target_audience.in_(["all", "students"])
    ).order_by(desc(Announcement.created_at)).offset(skip).limit(limit)

    results = q.all()

    filtered: List[Announcement] = []
    for ann in results:
        tgt_grades = ann.target_grades_students or []
        tgt_specials = ann.target_special_students or []

        if _matches_grade(student_grade, tgt_grades) and _matches_specials(student_specials, tgt_specials):
            filtered.append(ann)

    return filtered


def get_announcements_for_student_with_reasons(
    db: Session,
    student_grade: Optional[str],
    student_specials: Optional[List[str]] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Dict[str, Any]]:
    """
    Debug version: returns list of dicts: { announcement: Announcement, matched: bool, reasons: [...] }
    Useful for debugging why an announcement was included/excluded.
    """
    student_specials = student_specials or []

    q = db.query(Announcement).filter(
        Announcement.is_active == True,
        Announcement.target_audience.in_(["all", "students"])
    ).order_by(desc(Announcement.created_at)).offset(skip).limit(limit)

    results = q.all()

    out: List[Dict[str, Any]] = []
    for ann in results:
        reasons: List[str] = []

        tgt_grades = ann.target_grades_students or []
        tgt_specials = ann.target_special_students or []

        # grade check
        normalized_tgt_grades = _normalize_list_values(tgt_grades)
        if not normalized_tgt_grades:
            reasons.append("targets_all_regular_grades")
            grade_ok = True
        elif student_grade is None:
            reasons.append("student_has_no_grade")
            grade_ok = False
        elif str(student_grade).strip() in normalized_tgt_grades:
            reasons.append(f"grade_match ({student_grade})")
            grade_ok = True
        else:
            reasons.append(f"grade_mismatch (student {student_grade} not in {normalized_tgt_grades})")
            grade_ok = False

        # specials check
        normalized_tgt_specials = _normalize_list_values(tgt_specials)
        normalized_student_specials = _normalize_list_values(student_specials)
        if not normalized_tgt_specials:
            reasons.append("no_special_targeting")
            special_ok = True
        elif not normalized_student_specials:
            reasons.append("student_has_no_specials")
            special_ok = False
        elif set(normalized_tgt_specials).isdisjoint(set(normalized_student_specials)):
            reasons.append(f"specials_mismatch (student {normalized_student_specials} ∩ target {normalized_tgt_specials} == ∅)")
            special_ok = False
        else:
            common = set(normalized_tgt_specials).intersection(set(normalized_student_specials))
            reasons.append(f"specials_match ({list(common)})")
            special_ok = True

        matched = grade_ok and special_ok
        out.append({
            "announcement": ann,
            "matched": matched,
            "reasons": reasons,
            "target_grades_students": normalized_tgt_grades,
            "target_special_students": normalized_tgt_specials,
        })

    return out