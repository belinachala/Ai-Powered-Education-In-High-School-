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
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import joinedload

from app.db.session import get_db
from app.services.upload_service import upload_learning_material
from app.schemas.subject_upload import LearningMaterialResponse
from app.models.subject_upload import LearningMaterial
from app.models.user import User
from app.dependencies import get_current_user

router = APIRouter(prefix="/subject-upload", tags=["subject-upload"])


# ======================================================
# TEACHER: Upload new learning material
# ======================================================
@router.post(
    "/",
    response_model=LearningMaterialResponse,
    status_code=status.HTTP_201_CREATED,
)
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
        raise HTTPException(
            status_code=500,
            detail="Upload failed. Please try again.",
        )


# ======================================================
# DIRECTOR / ADMIN: Get all materials
# ======================================================
@router.get("/", status_code=200)
def get_all_materials(
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    if current_user.role not in ["schooldirector", "student"]:
        raise HTTPException(status_code=403, detail="Access denied")

    stmt = (
        select(LearningMaterial)
        .options(joinedload(LearningMaterial.uploader))
        .order_by(LearningMaterial.created_at.desc())
    )

    result = db.execute(stmt)               # ✅ no await
    materials = result.scalars().all()

    return {
        "materials": [
            {
                "id": m.id,
                "category": m.category,
                "stream": m.stream,
                "subject": m.subject,
                "file_path": m.file_path,
                "file_type": m.file_type,
                "approval": m.approval,
                "created_at": m.created_at,
                "uploader": {
                    "id": m.uploader.id,
                    "first_name": m.uploader.first_name,
                    "last_name": m.uploader.last_name,
                },
            }
            for m in materials
        ]
    }


# ======================================================
# DIRECTOR / ADMIN: Approve or Reject material
# ======================================================
@router.patch(
    "/review/{material_id}",
    status_code=status.HTTP_200_OK,
)
def review_material(
    material_id: int,
    payload: dict,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    if current_user.role not in ["schooldirector", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")

    approval = payload.get("approval")

    if approval not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Approval must be 'approved' or 'rejected'",
        )

    stmt = (
        update(LearningMaterial)
        .where(LearningMaterial.id == material_id)
        .values(approval=approval)
    )

    result = db.execute(stmt)
    db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Material not found")

    return {
        "message": f"Material {approval} successfully",
        "material_id": material_id,
        "status": approval,
    }
