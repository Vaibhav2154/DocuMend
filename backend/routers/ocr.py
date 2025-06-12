from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from services.ocr_service import OCRService
from typing import Optional
import tempfile
import os

router = APIRouter()

@router.post("/extract")
async def extract_text_to_json(
    file: UploadFile = File(...),
    clean_text: bool = Form(True),
    language: str = Form("eng")
):
    """
    Extract text from uploaded image or PDF and return AI-analyzed structured JSON output.
    
    - **file**: Image (JPG, PNG) or PDF file
    - **clean_text**: Whether to apply text cleaning (remove extra spaces, line breaks)
    - **language**: OCR language pack (eng, fra, deu, spa, etc.)
    """
    
    # Validate file type
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.pdf']
    file_extension = os.path.splitext(file.filename.lower())[1]
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_file_path = tmp_file.name
    
    try:
        print(f"Starting OCR processing for: {file.filename}")
        
        # Initialize OCR service
        ocr_service = OCRService(language=language)
        
        # Process file based on type
        if file_extension == '.pdf':
            result = await ocr_service.process_pdf(tmp_file_path, detect_key_values=False, clean_text=clean_text, use_llm=False)
        else:
            result = await ocr_service.process_image(tmp_file_path, detect_key_values=False, clean_text=clean_text, use_llm=False)
        
        print(f"Completed OCR processing for: {file.filename}")
        
        return {
            "filename": file.filename,
            "file_type": file_extension[1:].upper(),
            "processing_options": {
                "language": language,
                "text_cleaning": clean_text,
                "ai_analysis": True
            },
            "extracted_data": result,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)

@router.post("/analyze")
async def analyze_document_with_llm(
    file: UploadFile = File(...),
    analysis_type: str = Form("general"),
    language: str = Form("eng")
):
    """
    Analyze document using LLM for intelligent structure extraction.
    
    - **file**: Image (JPG, PNG) or PDF file
    - **analysis_type**: Type of analysis (general, invoice, identity, financial)
    - **language**: OCR language pack (eng, fra, deu, spa, etc.)
    """
    
    # Validate file type
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.pdf']
    file_extension = os.path.splitext(file.filename.lower())[1]
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Validate analysis type
    valid_analysis_types = ["general", "invoice", "identity", "financial"]
    if analysis_type not in valid_analysis_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid analysis type. Allowed: {', '.join(valid_analysis_types)}"
        )
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_file_path = tmp_file.name
    
    try:
        print(f"Starting LLM analysis for: {file.filename}")
        
        # Initialize OCR service
        ocr_service = OCRService(language=language)
        
        # Extract text first
        if file_extension == '.pdf':
            raw_text = await ocr_service.process_pdf(tmp_file_path, detect_key_values=False, clean_text=True, use_llm=False)
        else:
            raw_text = await ocr_service.process_image(tmp_file_path, detect_key_values=False, clean_text=True, use_llm=False)
        
        text_content = raw_text["processed_text"]
        
        # Perform LLM analysis
        structured_data = ocr_service.llm_enhanced_parsing(text_content, analysis_type)
        
        print(f"Completed LLM analysis for: {file.filename}")
        
        return {
            "filename": file.filename,
            "file_type": file_extension[1:].upper(),
            "analysis_type": analysis_type,
            "text_length": len(text_content),
            "structured_data": structured_data,
            "processing_timestamp": raw_text["processing_timestamp"],
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)

@router.get("/languages")
async def get_supported_languages():
    """Get list of supported OCR languages"""
    return {
        "supported_languages": {
            "eng": "English",
            "fra": "French", 
            "deu": "German",
            "spa": "Spanish",
            "ita": "Italian",
            "por": "Portuguese",
            "rus": "Russian",
            "chi_sim": "Chinese (Simplified)",
            "chi_tra": "Chinese (Traditional)",
            "jpn": "Japanese",
            "kor": "Korean",
            "ara": "Arabic",
            "hin": "Hindi"
        },
        "note": "Additional language packs may need to be installed"
    }
