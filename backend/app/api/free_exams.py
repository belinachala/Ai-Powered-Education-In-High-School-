from __future__ import annotations

import logging
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.orm import Session

from app.schemas.free_exam import (
    FreeExamCreate,
    FreeExamResponse,
    FreeExamDetailResponse,
    FreeExamListItem,
    QuestionOut,
    QuestionUpdate,
)
from app.db.session import get_db
from app.services.free_exam_service import (
    create_free_exam,
    get_free_exam_by_id,
    get_free_exams_for_user,
    update_question,
)
from app.dependencies import get_current_active_user
from app.models.user import User
from app.models.question import Question
from sqlalchemy.orm import joinedload

router = APIRouter(prefix="/free-exams", tags=["free_exams"])
logger = logging.getLogger("uvicorn.error")


@router.post("/", response_model=FreeExamDetailResponse, status_code=status.HTTP_201_CREATED)
def post_free_exam(
    payload: FreeExamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    logger.debug("Received create-free-exam payload: %s", payload.model_dump())

    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    try:
        exam = create_free_exam(db=db, exam_in=payload, created_by_id=current_user.id)
        # Fetch the fresh exam with relationships (to ensure all nested fields are present)
        fresh = get_free_exam_by_id(db=db, exam_id=exam.id)
        if not fresh:
            raise HTTPException(status_code=500, detail="Exam created but could not be retrieved")
        return fresh
    except HTTPException:
        # re-raise predictable HTTP exceptions (400/401)
        raise
    except Exception as exc:
        logger.exception("Unexpected error while creating free exam: %s", exc)
        # Generic 500 response (do not return raw exception in production)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/", response_model=List[FreeExamListItem])
def list_free_exams(
    category: Optional[str] = Query(None, description="Optional category filter: 'free' or 'paid'"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    List free exams created by the current user, optionally filtered by category.
    - category: optional query parameter; values: 'free' or 'paid'
    """
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    exams = get_free_exams_for_user(db=db, user_id=current_user.id)

    # If a category filter was provided, apply it (case-insensitive)
    if category:
        cat = category.strip().lower()
        if cat not in ("free", "paid"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category filter")
        exams = [e for e in exams if (getattr(e, "category", "") or "").lower() == cat]

    return exams


@router.get("/{exam_id}", response_model=FreeExamDetailResponse)
def get_free_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    exam = get_free_exam_by_id(db=db, exam_id=exam_id)
    if not exam:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Free exam not found")
    # Ownership check: only creator may read full detail (adjust as needed)
    if exam.created_by is not None and exam.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to view this exam")
    return exam


@router.patch("/{exam_id}/questions/{question_id}", response_model=QuestionOut)
def patch_question(
    exam_id: int = Path(..., description="Parent exam ID"),
    question_id: int = Path(..., description="Question ID to update"),
    payload: QuestionUpdate = Depends(),  # FastAPI will parse request body into QuestionUpdate
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a question (text, answer, MCQ options, matching pairs).
    Only the creator of the exam may update (ownership enforced).
    """
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    # Validate exam exists and ownership
    exam = get_free_exam_by_id(db=db, exam_id=exam_id)
    if not exam:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Free exam not found")
    if exam.created_by is not None and exam.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to modify this exam")

    # Ensure question belongs to exam
    q = db.query(Question).filter(Question.id == question_id, Question.exam_id == exam_id).first()
    if not q:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found for this exam")

    # call service to update
    updated = update_question(db=db, question_id=question_id, update=payload)

    # return updated question with nested options/pairs
    # load mcq_options and matching_pairs
    updated = db.query(Question).options(joinedload(Question.mcq_options), joinedload(Question.matching_pairs)).filter(Question.id == question_id).first()
    return updated