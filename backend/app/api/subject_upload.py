import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from typing import Optional, List, Dict
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
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers allowed")

    try:
        return await upload_learning_material(
            db=db,
            category=category,
            stream=stream,
            subject=subject,
            file=file,
            user_id=current_user.id
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Upload failed. Please try again.")


# ================================
# TEACHER: Get my uploads
# ================================
@router.get("/my-uploads", response_model=List[LearningMaterialResponse])
async def get_my_uploads(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers allowed")

    stmt = select(LearningMaterial).where(LearningMaterial.user_id == current_user.id)\
        .order_by(LearningMaterial.created_at.desc())
    result = await db.execute(stmt)
    materials = result.scalars().all()

    return materials


# ================================
# TEACHER: Get single material
# ================================
@router.get("/{material_id}", response_model=LearningMaterialResponse)
async def get_material(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers allowed")

    stmt = select(LearningMaterial).where(
        LearningMaterial.id == material_id,
        LearningMaterial.user_id == current_user.id
    )
    result = await db.execute(stmt)
    material = result.scalar_one_or_none()

    if not material:
        raise HTTPException(status_code=404, detail="Material not found or you don't have access")

    return material


# ================================
# TEACHER: Update pending material
# ================================
@router.patch("/{material_id}", response_model=LearningMaterialResponse)
async def update_material(
    material_id: int,
    category: Optional[str] = Form(None),
    stream: Optional[str] = Form(None),
    subject: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers allowed")

    # Get existing material
    stmt = select(LearningMaterial).where(
        LearningMaterial.id == material_id,
        LearningMaterial.user_id == current_user.id
    )
    result = await db.execute(stmt)
    material = result.scalar_one_or_none()

    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    if material.approval != "pending":
        raise HTTPException(status_code=400, detail="Can only update pending materials")

    update_data = {}
    if category is not None:
        update_data["category"] = category
    if stream is not None:
        update_data["stream"] = stream
    if subject is not None:
        update_data["subject"] = subject

    if file:
        await validate_file(file)
        file_type = get_file_extension(file.filename or "unknown")
        timestamp = int(datetime.now().timestamp())
        safe_subject = "".join(c for c in (subject or material.subject) if c.isalnum() or c in " _-").strip()
        unique_filename = f"{safe_subject.lower().replace(' ', '_')}_updated_{timestamp}{file_type}"
        new_file_path = generate_file_path(category or material.category, stream or material.stream, unique_filename)

        os.makedirs(os.path.dirname(new_file_path), exist_ok=True)
        file_content = await file.read()
        with open(new_file_path, "wb") as f:
            f.write(file_content)

        update_data["file_path"] = new_file_path
        update_data["file_type"] = file_type

    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")

    update_stmt = update(LearningMaterial).where(LearningMaterial.id == material_id).values(**update_data)
    await db.execute(update_stmt)
    await db.commit()
    await db.refresh(material)

    return material


# ================================
# STUDENT: Get approved materials
# ================================
@router.get("/approved", response_model=List[LearningMaterialResponse])
async def get_approved_materials(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students allowed")

    stmt = select(LearningMaterial).where(LearningMaterial.approval == "approved")\
        .order_by(LearningMaterial.created_at.desc())
    result = await db.execute(stmt)
    materials = result.scalars().all()

    return materials


# ================================
# DIRECTOR: Get pending materials
# ================================
@router.get("/pending", response_model=List[LearningMaterialResponse])
async def get_pending_materials(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "schooldirector":
        raise HTTPException(status_code=403, detail="Only school directors allowed")

    stmt = select(LearningMaterial).where(LearningMaterial.approval == "pending")
    result = db.execute(stmt)  # ← REMOVE await!
    materials = result.scalars().all()

    return materials


# ================================
# DIRECTOR: Approve or reject material
# ================================
@router.patch("/review/{material_id}", response_model=Dict[str, str])
async def review_material(
    material_id: int,
    approval_data: Dict[str, str],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "schooldirector":
        raise HTTPException(status_code=403, detail="Only school directors allowed")

    action = approval_data.get("approval")
    if action not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Approval must be 'approved' or 'rejected'")

    stmt = update(LearningMaterial).where(LearningMaterial.id == material_id).values(approval=action)
    result = db.execute(stmt)  # ← REMOVE await!
    db.commit()                # ← REMOVE await!

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Material not found")

    return {"message": f"Material {action} successfully"}