from __future__ import annotations
import logging
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
import re

from app.models.free_exam import FreeExam
from app.models.question import Question
from app.models.mcq_option import MCQOption
from app.models.matching_pair import MatchingPair
from app.schemas.free_exam import FreeExamCreate

logger = logging.getLogger("uvicorn.error")


def _validate_matching_answer_format(answer: str, n_pairs: int):
    parts = [p for p in re.split(r'[\s,]+', (answer or "").strip()) if p]
    if len(parts) != n_pairs:
        return False, "Number of answer letters must equal number of matching pairs"
    if not all(re.fullmatch(r'[A-Z]', p) for p in parts):
        return False, "Matching answers must be single uppercase letters A..Z"
    if len(set(parts)) != len(parts):
        return False, "Matching answers must not contain duplicates"
    return True, None


def _safe_get_field(model_obj, field_name: str):
    """
    Safely obtain a field from a Pydantic model instance regardless of Pydantic v1/v2 or missing attr.
    Returns None if not present.
    """
    # direct attribute access (may raise AttributeError on some Pydantic constructs)
    try:
        if hasattr(model_obj, field_name):
            val = getattr(model_obj, field_name)
            # Pydantic v2 may return Undefined or raise; guard by returning only non-callable simple values
            return val
    except Exception:
        pass

    # try pydantic v2 model_dump
    try:
        if hasattr(model_obj, "model_dump"):
            return model_obj.model_dump().get(field_name)
    except Exception:
        pass

    # try pydantic v1 dict()
    try:
        if hasattr(model_obj, "dict"):
            return model_obj.dict().get(field_name)
    except Exception:
        pass

    return None


def create_free_exam(db: Session, exam_in: FreeExamCreate, created_by_id: int):
    # Validate computed total_questions against provided
    computed_total = 0
    for q in exam_in.questions:
        if q.type == "MATCHING":
            computed_total += len(q.matches or [])
        else:
            computed_total += 1
    if computed_total != exam_in.total_questions:
        raise HTTPException(status_code=400, detail="total_questions does not match computed number of items")

    # Further validation for matching answers
    for q in exam_in.questions:
        if q.type == "MATCHING":
            ok, err = _validate_matching_answer_format(q.answer, len(q.matches or []))
            if not ok:
                raise HTTPException(status_code=400, detail=f"Question {q.id}: {err}")

    # Safely read optional category (default to "free")
    raw_category = _safe_get_field(exam_in, "category")
    category = (raw_category or "free").strip().lower() if isinstance(raw_category, str) else "free"
    if category not in ("free", "paid"):
        raise HTTPException(status_code=400, detail="Invalid category; expected 'free' or 'paid'")

    try:
        exam = FreeExam(
            title=exam_in.title.strip(),
            exam_type=exam_in.exam_type.strip(),
            grade=exam_in.grade.strip(),
            stream=exam_in.stream.strip() if exam_in.stream else None,
            subject=exam_in.subject.strip(),
            duration_minutes=exam_in.duration_minutes,
            start_datetime=exam_in.start_datetime,
            total_questions=exam_in.total_questions,
            status="pending_approval",
            created_by=created_by_id,
            category=category,
        )
        db.add(exam)
        db.flush()  # populate exam.id

        position = 0
        for q_in in exam_in.questions:
            # create question
            q = Question(
                exam_id=exam.id,
                client_id=q_in.id,
                type=q_in.type,
                text=(q_in.text or "").strip() or None,
                answer=(q_in.answer or "").strip(),
                position=position,
            )
            db.add(q)
            db.flush()  # populate q.id

            if q_in.type == "MCQ" and q_in.options:
                for key in ["A", "B", "C", "D"]:
                    opt_text = getattr(q_in.options, key).strip()
                    opt = MCQOption(question_id=q.id, key=key, text=opt_text)
                    db.add(opt)

                position += 1

            elif q_in.type == "MATCHING" and q_in.matches:
                for idx, pair in enumerate(q_in.matches):
                    mp = MatchingPair(
                        question_id=q.id,
                        position=idx,
                        left_text=pair.left.strip(),
                        right_text=pair.right.strip(),
                    )
                    db.add(mp)
                # count matching pairs as multiple items for ordering purposes
                position += len(q_in.matches)
            else:
                position += 1

        db.commit()
        db.refresh(exam)
        return exam
    except SQLAlchemyError as e:
        db.rollback()
        logger.exception("DB error creating free exam: %s", e)
        raise HTTPException(status_code=500, detail="Database error while creating free exam")


def get_free_exam_by_id(db: Session, exam_id: int) -> Optional[FreeExam]:
    exam = (
        db.query(FreeExam)
        .options(
            joinedload(FreeExam.questions)
            .joinedload(Question.mcq_options),
            joinedload(FreeExam.questions)
            .joinedload(Question.matching_pairs),
        )
        .filter(FreeExam.id == exam_id)
        .first()
    )
    return exam


def get_free_exams_for_user(db: Session, user_id: int) -> List[FreeExam]:
    exams = (
        db.query(FreeExam)
        .filter(FreeExam.created_by == user_id)
        .order_by(FreeExam.created_at.desc())
        .all()
    )
    return exams


def update_question(db: Session, question_id: int, update: 'QuestionUpdate') -> Question:
    """
    Update a question and its child options/pairs.
    Returns the refreshed Question ORM instance (with options/pairs).
    """
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    try:
        changed = False
        if getattr(update, "text", None) is not None:
            q.text = (update.text or "").strip()
            changed = True
        if getattr(update, "answer", None) is not None:
            q.answer = (update.answer or "").strip()
            changed = True

        # MCQ options handling: replace existing options if provided
        if getattr(update, "mcq_options", None) is not None:
            db.query(MCQOption).filter(MCQOption.question_id == q.id).delete(synchronize_session=False)
            for opt in update.mcq_options:
                if not opt.key or not opt.text:
                    continue
                db.add(MCQOption(question_id=q.id, key=opt.key.strip(), text=opt.text.strip()))
            changed = True

        # Matching pairs handling: replace existing pairs if provided
        if getattr(update, "matching_pairs", None) is not None:
            db.query(MatchingPair).filter(MatchingPair.question_id == q.id).delete(synchronize_session=False)
            for idx, mp in enumerate(update.matching_pairs):
                db.add(MatchingPair(question_id=q.id, position=idx, left_text=mp.left_text.strip(), right_text=mp.right_text.strip()))
            changed = True

        if changed:
            db.add(q)
            db.commit()
            db.refresh(q)
        return q
    except SQLAlchemyError as e:
        db.rollback()
        logger.exception("DB error updating question: %s", e)
        raise HTTPException(status_code=500, detail="Database error while updating question")