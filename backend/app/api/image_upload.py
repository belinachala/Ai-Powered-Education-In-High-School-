# app/api/image_upload.py

import os
from datetime import datetime
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
    status,
)
from sqlalchemy import select, update
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.image_upload_service import upload_teaching_image
from app.schemas.image_upload import TeachingImageResponse
from app.models.image_upload import TeachingImage
from app.models.user import User
from app.dependencies import get_current_user

router = APIRouter(prefix="/image-upload", tags=["image-upload"])


# ======================================================
# TEACHER: Upload new teaching image / diagram / photo
# ======================================================
@router.post(
    "/",
    response_model=TeachingImageResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_image(
    category: str = Form(...),
    stream: Optional[str] = Form(None),
    subject: str = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers allowed")

    try:
        image_record = await upload_teaching_image(
            db=db,
            category=category,
            stream=stream,
            subject=subject,
            title=title,
            file=file,
            user_id=current_user.id,
        )
        return image_record
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Image upload failed. Please try again.",
        )


# ======================================================
# STUDENT: Get approved + pending images (gallery view)
# DIRECTOR / ADMIN: Get all images (pending + approved + rejected)
# ======================================================
@router.get("/", status_code=200)
def get_all_images(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in ["student", "schooldirector", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")

    # Students → approved + pending images
    if current_user.role == "student":
        stmt = (
            select(TeachingImage)
            .where(TeachingImage.approval.in_(["approved", "pending"]))
            .options(joinedload(TeachingImage.uploader))
            .order_by(TeachingImage.created_at.desc())
        )
    # Directors / Admins → all images
    else:
        stmt = (
            select(TeachingImage)
            .options(joinedload(TeachingImage.uploader))
            .order_by(TeachingImage.created_at.desc())
        )

    result = db.execute(stmt)  # ✅ synchronous like subject_upload.py
    images = result.scalars().all()

    return {
        "images": [
            {
                "id": img.id,
                "category": img.category,
                "stream": img.stream,
                "subject": img.subject,
                "title": img.title,
                "file_path": img.file_path,
                "file_type": img.file_type,
                "approval": img.approval,
                "created_at": img.created_at,
                "uploader": {
                    "id": img.uploader.id,
                    "first_name": img.uploader.first_name,
                    "last_name": img.uploader.last_name,
                },
            }
            for img in images
        ]
    }


# ======================================================
# DIRECTOR / ADMIN: Approve or Reject image
# ======================================================
@router.patch("/review/{image_id}", status_code=status.HTTP_200_OK)
def review_image(
    image_id: int,
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in ["schooldirector", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")

    approval = payload.get("approval")
    if approval not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=400, detail="Approval must be 'approved' or 'rejected'"
        )

    stmt = (
        update(TeachingImage)
        .where(TeachingImage.id == image_id)
        .values(approval=approval)
    )

    result = db.execute(stmt)
    db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Image not found")

    return {
        "message": f"Image {approval} successfully",
        "image_id": image_id,
        "status": approval,
    }
