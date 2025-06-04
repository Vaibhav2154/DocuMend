import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import tempfile
import os
import shutil
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
import asyncio
from functools import partial

def configure_tesseract():
    # Set optimized tesseract config for speed
    pytesseract.pytesseract.tesseract_cmd = shutil.which('tesseract') or '/usr/bin/tesseract'
    return pytesseract.pytesseract.tesseract_cmd is not None

# Optimized OCR configuration for speed
FAST_OCR_CONFIG = '--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?;:()[]{}"\'-_@#$%^&*+=<>/\\|`~ '

def extract_text_from_image(image, page_num):
    """Extract text from a single image with optimized settings"""
    try:
        # Resize image if too large (speeds up OCR significantly)
        width, height = image.size
        if width > 2000 or height > 2000:
            # Maintain aspect ratio while reducing size
            ratio = min(2000/width, 2000/height)
            new_size = (int(width * ratio), int(height * ratio))
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        
        # Convert to grayscale for faster processing
        if image.mode != 'L':
            image = image.convert('L')
        
        # Use fast OCR configuration
        text = pytesseract.image_to_string(
            image, 
            config=FAST_OCR_CONFIG,
            timeout=30  # 30 second timeout per page
        )
        return f"[Page {page_num + 1}]\n{text}\n"
    except Exception as e:
        return f"[Page {page_num + 1}] - Error extracting text: {str(e)}\n"

async def extract_text_from_pdf(file_path: str) -> str:
    """Async PDF text extraction with parallel processing"""
    try:
        if not configure_tesseract():
            raise Exception("Tesseract OCR is not installed or not found in PATH")
        
        # Convert PDF to images with optimized settings
        print(f"Converting PDF to images: {file_path}")
        images = convert_from_path(
            file_path,
            dpi=150,  # Reduced DPI for speed (was likely 300+ by default)
            output_folder=tempfile.gettempdir(),
            first_page=1,
            last_page=None,
            fmt='jpeg',  # JPEG is faster than PNG
            jpegopt={'quality': 85, 'optimize': True}
        )
        
        print(f"Processing {len(images)} pages with parallel OCR")
        
        # Use ThreadPoolExecutor for parallel OCR processing
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor(max_workers=min(4, len(images))) as executor:
            # Create tasks for parallel processing
            tasks = []
            for i, image in enumerate(images):
                task = loop.run_in_executor(
                    executor, 
                    extract_text_from_image, 
                    image, 
                    i
                )
                tasks.append(task)
            
            # Wait for all tasks to complete
            results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Combine results
        full_text = ""
        for result in results:
            if isinstance(result, Exception):
                full_text += f"Error processing page: {str(result)}\n"
            else:
                full_text += result
        
        print("PDF processing completed")
        return full_text.strip()
        
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")

# Synchronous wrapper for backward compatibility
def extract_text_from_pdf_sync(file_path: str) -> str:
    """Synchronous wrapper for the async function"""
    return asyncio.run(extract_text_from_pdf(file_path))
