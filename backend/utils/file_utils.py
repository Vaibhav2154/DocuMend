import os
import shutil
from fastapi import UploadFile

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_upload_file(upload_file: UploadFile) -> str:
    filename = f"{UPLOAD_DIR}/{upload_file.filename}"
    with open(filename, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return filename
