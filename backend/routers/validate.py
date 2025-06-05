from fastapi import APIRouter, UploadFile, File, HTTPException
from services.image_validation import extract_text_from_pdf_async
import tempfile
import os
import asyncio

router = APIRouter()

@router.post("/pdf")
async def process_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_file_path = tmp_file.name
    
    try:
        print(f"Starting PDF processing for: {file.filename}")
        # Use the async version
        extracted_text = await extract_text_from_pdf_async(tmp_file_path)
        print(f"Completed PDF processing for: {file.filename}")
        
        return {
            "filename": file.filename,
            "extracted_text": extracted_text,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)
