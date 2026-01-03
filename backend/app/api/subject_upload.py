import os
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.db.session import get_db
from app.services.upload_service import upload_learning_material
from app.schemas.subject_upload import LearningMaterialResponse
from app.models.subject_upload import LearningMaterial
from app.models.user import User
from app.dependencies import get_current_user
from app.utils.file_utils import validate_file, get_file_extension, generate_file_path

router = APIRouter(prefix="/subject-upload", tags=["subject-upload"])


# ================================
# TEACHER: Upload new material
# ================================
@router.post("/", response_model=LearningMaterialResponse, status_code=status.HTTP_201_CREATED)
async def upload_material(
    category: str = Form(...),
    stream: Optional[str] = Form(None),
    subject: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers allowed")

    try:
        material = await upload_learning_material(
            db=db,
            category=category,
            stream=stream,
            subject=subject,
            file=file,
            user_id=current_user.id,
        )
        return material
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        raise HTTPException(status_code=500, detail="Upload failed. Please try again.")

 