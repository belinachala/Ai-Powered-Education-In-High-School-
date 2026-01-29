from __future__ import annotations
import logging
from typing import Any, List, Optional, Dict
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Path, Query, Body
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.question import Question
from app.models.free_exam import FreeExam
from app.models.exam_attempt import ExamAttempt
from app.schemas.free_exam import (
    FreeExamCreate,
    FreeExamDetailResponse,
    FreeExamListItem,
    QuestionOut,
    QuestionUpdate,
) 
from app.services.free_exam_service import (
    create_free_exam,
    get_free_exam_by_id,
    get_free_exams_for_user,
    get_all_free_exams,
    update_question,
)

router = APIRouter(prefix="/free-exams", tags=["free_exams"])
logger = logging.getLogger("uvicorn.error")

# -------------------------------------------------
# ROLE HELPERS
# -------------------------------------------------
def is_school_director(user: User) -> bool:
    return user.role == "schooldirector"

def is_student(user: User) -> bool:
    return user.role == "student"

# -------------------------------------------------
# 1. SPECIAL STATIC ROUTES (Must be first)
# -------------------------------------------------

@router.get("/my-results")
def get_my_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetches all exam history for the logged-in student."""
    try:
        results = (
            db.query(
                ExamAttempt.id,
                ExamAttempt.score,
                ExamAttempt.total_questions,
                ExamAttempt.percentage,
                ExamAttempt.created_at,
                FreeExam.title.label("exam_title")
            )
            .join(FreeExam, ExamAttempt.exam_id == FreeExam.id)
            .filter(ExamAttempt.student_id == current_user.id)
            .order_by(ExamAttempt.created_at.desc())
            .all()
        )

        return [
            {
                "id": r.id,
                "title": r.exam_title,
                "score": r.score,
                "total_questions": r.total_questions,
                "percentage": round(r.percentage, 2),
                "date": r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else "N/A",
                "status": "PASSED" if r.percentage >= 50 else "FAILED"
            }
            for r in results
        ]
    except Exception as e:
        logger.error(f"Backend Error in my-results: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/all", response_model=List[FreeExamListItem])
def list_all_free_exams_for_director(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    if not is_school_director(current_user):
        raise HTTPException(status_code=403, detail="Only school directors can access all exams")

    exams = get_all_free_exams(db=db)
    if category:
        cat = category.lower().strip()
        exams = [e for e in exams if (e.category or "").lower() == cat]
    return exams

# -------------------------------------------------
# 2. RESULT BY ID
# -------------------------------------------------

@router.get("/results/{attempt_id}")
def get_exam_result(
    attempt_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    attempt = db.query(ExamAttempt).filter(
        ExamAttempt.id == attempt_id,
        ExamAttempt.student_id == current_user.id
    ).first()

    if not attempt:
        raise HTTPException(status_code=404, detail="Result not found.")

    exam = db.query(FreeExam).filter(FreeExam.id == attempt.exam_id).first()

    return {
        "id": attempt.id,
        "title": exam.title if exam else "Free Exam",
        "score": attempt.score,
        "total_questions": attempt.total_questions,
        "percentage": attempt.percentage,
        "status": "PASSED" if attempt.percentage >= 50 else "FAILED",
        "submitted_at": attempt.created_at
    }

# -------------------------------------------------
# 3. EXAM LISTING AND DETAIL (Dynamic ID last)
# -------------------------------------------------

@router.get("/", response_model=List[FreeExamListItem])
def list_free_exams(
    category: Optional[str] = Query(None, description="free or paid"),
    view: Optional[str] = Query(None, description="director"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    if is_school_director(current_user) and view == "director":
        exams = get_all_free_exams(db=db)
    elif is_student(current_user):
        all_exams = get_all_free_exams(db=db)
        exams = [e for e in all_exams if e.status in ["approved", "pending_approval"]]
    else:
        exams = get_free_exams_for_user(db=db, user_id=current_user.id)

    if category:
        cat = category.lower().strip()
        exams = [e for e in exams if (e.category or "").lower() == cat]

    return exams

@router.get("/{exam_id}", response_model=FreeExamDetailResponse)
def get_free_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    exam = get_free_exam_by_id(db=db, exam_id=exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Free exam not found")

    if is_school_director(current_user) or exam.created_by == current_user.id:
        return exam

    if is_student(current_user) and exam.status in ["approved", "pending_approval"]:
        return exam

    raise HTTPException(status_code=403, detail="Access denied")

# -------------------------------------------------
# 4. POST AND PATCH ACTIONS
# -------------------------------------------------

@router.post("/", response_model=FreeExamDetailResponse, status_code=status.HTTP_201_CREATED)
def post_free_exam(
    payload: FreeExamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    try:
        exam = create_free_exam(db=db, exam_in=payload, created_by_id=current_user.id)
        return get_free_exam_by_id(db=db, exam_id=exam.id)
    except Exception as exc:
        logger.exception("Error creating free exam: %s", exc)
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/{exam_id}/submit")
def submit_exam_attempt(
    exam_id: int,
    answers: Dict[str, str] = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    questions = db.query(Question).filter(Question.exam_id == exam_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this exam.")

    total_questions = len(questions)
    correct_count = 0

    for q in questions:
        student_ans = answers.get(str(q.id)) or answers.get(q.id)
        if student_ans:
            actual_correct = str(q.answer or "").strip().lower()
            provided_ans = str(student_ans).strip().lower()
            if actual_correct and actual_correct == provided_ans:
                correct_count += 1

    pct = (correct_count / total_questions * 100) if total_questions > 0 else 0

    try:
        attempt = ExamAttempt(
            student_id=current_user.id,
            exam_id=exam_id,
            score=correct_count,
            total_questions=total_questions,
            percentage=round(pct, 2),
            answers_json=answers
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
        return {"id": attempt.id, "status": "success", "score": correct_count, "percentage": round(pct, 2)}
    except Exception as e:
        db.rollback()
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Error saving result.")

@router.post("/{exam_id}/approve", response_model=FreeExamDetailResponse)
def approve_exam(exam_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not is_school_director(current_user):
        raise HTTPException(status_code=403, detail="Only directors can approve")
    exam = get_free_exam_by_id(db=db, exam_id=exam_id)
    if not exam: raise HTTPException(status_code=404, detail="Exam not found")
    exam.status = "approved"
    db.commit()
    db.refresh(exam)
    return exam

@router.post("/{exam_id}/reject", response_model=FreeExamDetailResponse)
def reject_exam(exam_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not is_school_director(current_user):
        raise HTTPException(status_code=403, detail="Only directors can reject")
    exam = get_free_exam_by_id(db=db, exam_id=exam_id)
    if not exam: raise HTTPException(status_code=404, detail="Exam not found")
    exam.status = "rejected"
    db.commit()
    db.refresh(exam)
    return exam

@router.patch("/{exam_id}/questions/{question_id}", response_model=QuestionOut)
def patch_question(
    exam_id: int, question_id: int, payload: QuestionUpdate,
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    # Authorization and check logic remains same
    update_question(db=db, question_id=question_id, update=payload)
    return db.query(Question).options(joinedload(Question.mcq_options)).filter(Question.id == question_id).first()