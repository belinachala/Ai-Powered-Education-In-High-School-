from __future__ import annotations
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, model_validator
from datetime import datetime

QuestionType = Literal["MCQ", "TRUE_FALSE", "BLANK", "MATCHING"]


class MCQOptions(BaseModel):
    A: str
    B: str
    C: str
    D: str


class MatchingPairIn(BaseModel):
    left: str
    right: str


class QuestionCreate(BaseModel):
    id: str
    type: QuestionType
    text: Optional[str] = ""
    options: Optional[MCQOptions] = None
    answer: str
    matches: Optional[List[MatchingPairIn]] = None

    @model_validator(mode="after")
    def validate_by_type(self):
        qtype = self.type
        answer = (self.answer or "").strip()

        if qtype != "MATCHING" and not (self.text or "").strip():
            raise ValueError("Question text is required for non-matching questions")

        if qtype == "MCQ":
            opts = self.options
            if not opts or not all(getattr(opts, k).strip() for k in ["A", "B", "C", "D"]):
                raise ValueError("All MCQ options (A-D) are required and non-empty")
            if answer not in {"A", "B", "C", "D"}:
                raise ValueError("MCQ answer must be one of 'A','B','C','D'")

        elif qtype == "TRUE_FALSE":
            if answer not in {"True", "False"}:
                raise ValueError("TRUE_FALSE answer must be 'True' or 'False'")

        elif qtype == "BLANK":
            if not answer:
                raise ValueError("BLANK type requires a non-empty answer")

        elif qtype == "MATCHING":
            matches = self.matches or []
            if not matches:
                raise ValueError("MATCHING type must include matches array")

        return self


class FreeExamCreate(BaseModel):
    title: str = Field(..., min_length=1)
    exam_type: str = Field(..., min_length=1)
    grade: str = Field(..., min_length=1)
    stream: Optional[str] = None
    subject: str = Field(..., min_length=1)
    duration_minutes: int = Field(..., gt=0)
    start_datetime: datetime
    questions: List[QuestionCreate]
    total_questions: int = Field(..., ge=0)


# ----- Output schemas -----
class MCQOptionOut(BaseModel):
    key: str
    text: str

    model_config = {"from_attributes": True}


class MatchingPairOut(BaseModel):
    position: int
    left_text: str
    right_text: str

    model_config = {"from_attributes": True}


class QuestionOut(BaseModel):
    id: int
    client_id: Optional[str]
    type: QuestionType
    text: Optional[str] = None
    answer: Optional[str] = None
    position: int
    mcq_options: Optional[List[MCQOptionOut]] = None
    matching_pairs: Optional[List[MatchingPairOut]] = None

    model_config = {"from_attributes": True}


class FreeExamDetailResponse(BaseModel):
    id: int
    title: str
    exam_type: str
    grade: str
    stream: Optional[str] = None
    subject: str
    duration_minutes: int
    start_datetime: datetime
    total_questions: int
    status: str
    created_by: Optional[int] = None
    reviewed_by_id: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    questions: List[QuestionOut] = []

    model_config = {"from_attributes": True}


class FreeExamResponse(BaseModel):
    id: int
    status: str
    message: str

    model_config = {"from_attributes": True}


# Lightweight list item
class FreeExamListItem(BaseModel):
    id: int
    title: str
    subject: str
    grade: str
    status: str
    total_questions: int
    start_datetime: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ----- New: input types for updates -----
class MCQOptionIn(BaseModel):
    key: str
    text: str


class MatchingPairUpdateIn(BaseModel):
    left_text: str
    right_text: str


class QuestionUpdate(BaseModel):
    text: Optional[str] = None
    answer: Optional[str] = None
    mcq_options: Optional[List[MCQOptionIn]] = None
    matching_pairs: Optional[List[MatchingPairUpdateIn]] = None

    # extra validation can be added if needed