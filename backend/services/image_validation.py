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
    """Extract text from a single image with debugging"""
    try:
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(image, config=custom_config)
        
        # Debug: Print raw text (first 100 chars)
        print(f"Raw OCR text for page {page_num + 1}: {repr(text[:100])}")
        
        if text:
            # Check for problematic characters
            problematic_chars = ['"', '"', '"', "'", "'"]
            for char in problematic_chars:
                if char in text:
                    print(f"Found problematic character: {repr(char)}")
            
            # Clean the text
            cleaned_text = text.encode('utf-8', 'ignore').decode('utf-8')
            return f"[Page {page_num + 1}] {cleaned_text.strip()}\n"
        else:
            return f"[Page {page_num + 1}] - No text extracted\n"
            
    except Exception as e:
        print(f"OCR Exception on page {page_num + 1}: {type(e).__name__}: {str(e)}")
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
        
        if not images:
            raise Exception("No pages could be extracted from PDF")
        
        # Add validation for image quality
        for i, image in enumerate(images):
            if image.size[0] < 100 or image.size[1] < 100:
                print(f"Warning: Page {i+1} image is very small: {image.size}")
        
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

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF with better error handling"""
    try:
        print(f"Processing PDF: {pdf_path}")
        
        # Convert PDF to images with higher DPI for better OCR
        images = convert_from_path(pdf_path, dpi=300, fmt='jpeg')
        print(f"Converted PDF to {len(images)} images")
        
        if not images:
            return "Error: No pages found in PDF"
        
        extracted_text = ""
        for i, image in enumerate(images):
            print(f"Processing page {i + 1}, image size: {image.size}")
            
            # Enhance image for better OCR
            image = image.convert('RGB')
            
            page_text = extract_text_from_image(image, i)
            extracted_text += page_text
            
        return extracted_text.strip()
        
    except Exception as e:
        print(f"PDF processing error: {type(e).__name__}: {str(e)}")
        return f"Error processing PDF: {str(e)}"

# Synchronous wrapper for backward compatibility
def extract_text_from_pdf_sync(file_path: str) -> str:
    """Synchronous wrapper for the async function"""
    return asyncio.run(extract_text_from_pdf(file_path))
