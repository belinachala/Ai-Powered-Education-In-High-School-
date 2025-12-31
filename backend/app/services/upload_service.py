import os
from datetime import datetime
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert

from app.models.subject_upload import LearningMaterial
from app.utils.file_utils import validate_file, get_file_extension, generate_file_path

async def upload_learning_material(
    db: AsyncSession,
    category: str,
    stream: str | None,
    subject: str,
    file: UploadFile,
    user_id: int
) -> LearningMaterial:
    print("1. Starting upload...")
    
    await validate_file(file)
    print("2. File validated")

    file_type = get_file_extension(file.filename or "unknown")
    print(f"3. File type: {file_type}")

    timestamp = int(datetime.now().timestamp())
    safe_subject = "".join(c for c in subject if c.isalnum() or c in " _-").strip()
    unique_filename = f"{safe_subject.lower().replace(' ', '_')}_{timestamp}{file_type}"
    file_path = generate_file_path(category, stream, unique_filename)
    print(f"4. File path: {file_path}")

    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    file_content = await file.read()
    print(f"5. File read ({len(file_content)} bytes)")

    try:
        with open(file_path, "wb") as f:
            f.write(file_content)
        print("6. File saved to disk")
    except Exception as e:
        print(f"ERROR saving file: {e}")
        raise

    print("7. Starting DB insert...")
    stmt = insert(LearningMaterial).values(
        category=category,
        stream=stream,
        subject=subject,
        file_path=file_path,
        file_type=file_type,
        user_id=user_id,
        approval="pending"
    ).returning(LearningMaterial.id)

    try:
        result = db.execute(stmt)  # No await
        print("8. DB execute done")
        
        db.commit()  # ← NO AWAIT!
        print("9. DB commit done")
    except Exception as e:
        print(f"DB ERROR: {e}")
        raise

    inserted_id = result.scalar_one()
    print(f"10. Inserted ID: {inserted_id}")

    uploaded_material = db.get(LearningMaterial, inserted_id)  # ← CORRECT (no await)
    print("11. Object fetched from DB")

    return uploaded_material