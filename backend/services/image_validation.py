import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import tempfile
import os
import shutil
import subprocess

def configure_tesseract():
    # Try to find tesseract in common locations
    possible_paths = [
        '/usr/bin/tesseract',  # Linux (Render)
        '/usr/local/bin/tesseract',  # macOS
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',  # Windows
        '/app/tesseract',  # Custom Docker path
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            print(f"Found tesseract at: {path}")
            return True
    
    # If not found in common paths, try to find it using which
    try:
        tesseract_path = subprocess.check_output(['which', 'tesseract'], universal_newlines=True).strip()
        if tesseract_path and os.path.exists(tesseract_path):
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
            print(f"Found tesseract via which: {tesseract_path}")
            return True
    except subprocess.CalledProcessError:
        pass
    
    # Try shutil.which as fallback
    tesseract_path = shutil.which('tesseract')
    if tesseract_path:
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
        print(f"Found tesseract via shutil.which: {tesseract_path}")
        return True
    
    print("Tesseract not found in any common locations")
    return False

# Configure tesseract on module import
configure_tesseract()

def extract_text_from_pdf(file_path: str) -> str:
    try:
        # Verify tesseract is available before proceeding
        if not configure_tesseract():
            raise Exception("Tesseract OCR is not installed or not found in PATH")
        
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
