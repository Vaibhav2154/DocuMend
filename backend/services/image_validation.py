import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import tempfile
import os
import shutil
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Configure tesseract path for different environments
def configure_tesseract():
    # Try to find tesseract in common locations
    possible_paths = [
        '/usr/bin/tesseract',  # Linux (Render)
        '/usr/local/bin/tesseract',  # macOS
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',  # Windows
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            return
    
    # If not found in common paths, try to find it using which/where
    tesseract_path = shutil.which('tesseract')
    if tesseract_path:
        pytesseract.pytesseract.tesseract_cmd = tesseract_path

# Configure tesseract on module import
configure_tesseract()

def extract_text_from_pdf(file_path: str) -> str:
    try:
        images = convert_from_path(file_path)
        full_text = ""
        for img in images:
            text = pytesseract.image_to_string(img)
            full_text += text + "\n"
        return full_text.strip()
    except pytesseract.TesseractNotFoundError:
        raise Exception("Tesseract OCR is not installed or not found in PATH. Please ensure Tesseract is properly installed.")
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")

async def extract_text_from_pdf_async(file_path: str) -> str:
    """Async wrapper for extract_text_from_pdf to avoid blocking the event loop"""
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as executor:
        return await loop.run_in_executor(executor, extract_text_from_pdf, file_path)
