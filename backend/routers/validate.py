from fastapi import APIRouter, UploadFile, Form
from services.image_validation import extract_text_from_pdf
from utils.file_utils import save_upload_file
from fastapi.responses import JSONResponse
import uuid

router = APIRouter()

@router.post("/pdf")
async def process_pdf(file: UploadFile, user_id: str = Form(...)):
    filename = await save_upload_file(file)
    extracted_text = extract_text_from_pdf(filename)
    return JSONResponse(content={"user_id": user_id, "text": extracted_text})
