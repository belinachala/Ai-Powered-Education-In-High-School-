# app/services/image_upload_service.py

import os
from datetime import datetime
from uuid import uuid4

import aiofiles
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert

from app.models.image_upload import TeachingImage
from app.utils.file_utils import validate_file, get_file_extension, generate_file_path


async def upload_teaching_image(
    db: AsyncSession,
    category: str,
    stream: str | None,
    subject: str,
    title: str,
    file: UploadFile,
    user_id: int
) -> TeachingImage:
    print("1. Starting upload...")

    # Image-specific validation
    from app.utils.file_utils import IMAGE_EXTENSIONS
    await validate_file(
        file,
        allowed_extensions=IMAGE_EXTENSIONS,
        max_size_mb=10  # smaller limit for images
    )
    print("2. File validated")

    file_type = get_file_extension(file.filename or "unknown")
    print(f"3. File type: {file_type}")

    timestamp = int(datetime.now().timestamp())
    safe_subject = "".join(c for c in subject if c.isalnum() or c in " _-").strip()
    safe_title   = "".join(c for c in title   if c.isalnum() or c in " _-").strip()
    unique_filename = f"{safe_subject.lower().replace(' ', '_')}_{safe_title.lower().replace(' ', '_')}_{timestamp}_{uuid4().hex[:6]}{file_type}"

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
        if os.path.exists(file_path):
            os.remove(file_path)
        raise

    print("7. Starting DB insert...")
    stmt = insert(TeachingImage).values(
        category=category,
        stream=stream,
        subject=subject,
        title=title.strip(),
        file_path=file_path,
        file_type=file_type.lstrip("."),  # store without dot (e.g. "jpg")
        user_id=user_id,
        approval="pending"  # ← correct default (pending, not approved)
    ).returning(TeachingImage.id)

    try:
        result = db.execute(stmt)           # ← no await (matches your document style)
        print("8. DB execute done")

        db.commit()                         # ← no await
        print("9. DB commit done")
    except Exception as e:
        print(f"DB ERROR: {e}")
        db.rollback()                       # cleanup on error
        raise

    inserted_id = result.scalar_one()
    print(f"10. Inserted ID: {inserted_id}")

    uploaded_image = db.get(TeachingImage, inserted_id)  # ← no await
    print("11. Object fetched from DB")

    return uploaded_image