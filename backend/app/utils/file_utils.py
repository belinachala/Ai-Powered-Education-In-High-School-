import os
from fastapi import UploadFile

# Allowed extensions (lowercase)
ALLOWED_EXTENSIONS = {".pdf", ".ppt", ".pptx", ".doc", ".docx"}

async def validate_file(file: UploadFile):
    """
    Validate uploaded file by extension and size (async).
    Raises ValueError if invalid.
    """
    if file.filename is None:
        raise ValueError("No file selected.")

    # Get file extension
    _, ext = os.path.splitext(file.filename)
    ext = ext.lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError("Invalid file type. Allowed: PDF, PPT, PPTX, DOC, DOCX")

    # Read content asynchronously for size check
    MAX_SIZE = 50 * 1024 * 1024  # 50 MB
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise ValueError("File too large. Maximum size is 50 MB.")
    if len(content) == 0:
        raise ValueError("File is empty.")

    # IMPORTANT: Reset the file pointer so the service can read it again
    await file.seek(0)

    return True

def get_file_extension(filename: str) -> str:
    """
    Return extension with dot (e.g., '.pdf')
    """
    _, ext = os.path.splitext(filename)
    return ext.lower() if ext else ".pdf"

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

    full_path = os.path.join(base_path, subfolder, filename)
    return full_path