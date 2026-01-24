# app/utils/file_utils.py

import os
from fastapi import UploadFile, HTTPException

# Default allowed extensions for documents (your original)
DOCUMENT_EXTENSIONS = {".pdf", ".ppt", ".pptx", ".doc", ".docx"}

# Allowed extensions for images
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


async def validate_file(
    file: UploadFile,
    allowed_extensions: set = DOCUMENT_EXTENSIONS,
    max_size_mb: int = 50
) -> bool:
    """
    Validate uploaded file by extension, size, and emptiness.
    Raises ValueError on failure.
    """
    if not file.filename:
        raise ValueError("No file selected or filename missing.")

    # Get extension
    _, ext = os.path.splitext(file.filename)
    ext = ext.lower()

    if ext not in allowed_extensions:
        allowed_str = ", ".join(e.lstrip(".") for e in sorted(allowed_extensions))
        raise ValueError(f"Invalid file type. Allowed: {allowed_str.upper()}")

    # Size limit (stream read to avoid memory issues with large files)
    MAX_SIZE = max_size_mb * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise ValueError(f"File too large. Maximum size is {max_size_mb} MB.")
    if len(content) == 0:
        raise ValueError("File is empty.")

    # Reset pointer so service can read the file again
    await file.seek(0)

    return True


def get_file_extension(filename: str) -> str:
    """
    Return extension with dot (e.g., '.jpg')
    """
    _, ext = os.path.splitext(filename)
    return ext.lower() if ext else ""


def generate_file_path(category: str, stream: str | None, filename: str) -> str:
    """
    Generate organized file path based on category and stream.
    """
    base_path = "uploads/teachers/"

    if category in ["grade11", "grade12", "entrance", "remedial"]:
        if not stream:
            raise ValueError("Stream is required for this category.")
        subfolder = f"{category}_{stream.lower()}"
    else:
        subfolder = category

    # For images: optional subfolder separation
    # full_path = os.path.join(base_path, subfolder, "images", filename)
    full_path = os.path.join(base_path, subfolder, filename)  # same as documents

    return full_path