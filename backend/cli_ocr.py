#!/usr/bin/env python3
"""
OCR-to-JSON CLI Tool
Command-line interface for DocuMend's OCR functionality.
"""

import argparse
import json
import sys
import asyncio
from pathlib import Path
from typing import Optional

# Import the OCR service
try:
    from services.ocr_service import OCRService
except ImportError:
    print("Error: This CLI tool should be run from the backend directory.")
    print("Usage: cd backend && python cli_ocr.py [options]")
    sys.exit(1)


async def process_file(
    file_path: str,
    output_path: Optional[str] = None,
    language: str = "eng",
    detect_key_values: bool = True,
    clean_text: bool = True,
    format_output: str = "json"
) -> dict:
    """Process a file and return OCR results."""
    
    # Validate file exists
    if not Path(file_path).exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    
    # Initialize OCR service
    ocr_service = OCRService(language=language)
    
    # Determine file type
    file_extension = Path(file_path).suffix.lower()
    
    print(f"Processing {file_path}...")
    print(f"Language: {language}")
    print(f"Key-value detection: {'ON' if detect_key_values else 'OFF'}")
    print(f"Text cleaning: {'ON' if clean_text else 'OFF'}")
    print("-" * 50)
    
    try:
        if file_extension == '.pdf':
            result = await ocr_service.process_pdf(file_path, detect_key_values, clean_text)
        elif file_extension in ['.jpg', '.jpeg', '.png']:
            result = await ocr_service.process_image(file_path, detect_key_values, clean_text)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
        
        # Create response structure similar to API
        response = {
            "filename": Path(file_path).name,
            "file_type": file_extension[1:].upper(),
            "processing_options": {
                "language": language,
                "key_value_detection": detect_key_values,
                "text_cleaning": clean_text
            },
            "extracted_data": result,
            "status": "success"
        }
        
        # Output results
        if format_output == "json":
            if output_path:
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(response, f, indent=2, ensure_ascii=False)
                print(f"✅ Results saved to: {output_path}")
            else:
                print(json.dumps(response, indent=2, ensure_ascii=False))
        
        elif format_output == "text":
            print("🔍 EXTRACTED TEXT:")
            print("-" * 50)
            print(result["processed_text"])
            
            if detect_key_values and result.get("key_value_pairs"):
                print("\n🔑 KEY-VALUE PAIRS:")
                print("-" * 50)
                for key, values in result["key_value_pairs"].items():
                    print(f"{key.replace('_', ' ').title()}: {', '.join(values)}")
        
        return response
        
    except Exception as e:
        error_response = {
            "filename": Path(file_path).name,
            "error": str(e),
            "status": "error"
        }
        
        if output_path:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(error_response, f, indent=2)
        
        raise e


def main():
    parser = argparse.ArgumentParser(
        description="OCR-to-JSON CLI Tool - Extract text from images and PDFs",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python cli_ocr.py document.pdf
  python cli_ocr.py image.jpg --language fra --output result.json
  python cli_ocr.py scan.png --no-key-detection --format text
  python cli_ocr.py invoice.pdf --output invoice_data.json --language deu

Supported Languages:
  eng (English), fra (French), deu (German), spa (Spanish), 
  ita (Italian), por (Portuguese), rus (Russian), chi_sim (Chinese Simplified),
  chi_tra (Chinese Traditional), jpn (Japanese), kor (Korean), 
  ara (Arabic), hin (Hindi)
        """
    )
    
    # Required arguments
    parser.add_argument(
        "file",
        help="Path to the input file (JPG, PNG, or PDF)"
    )
    
    # Optional arguments
    parser.add_argument(
        "-o", "--output",
        help="Output file path for JSON results (default: print to stdout)"
    )
    
    parser.add_argument(
        "-l", "--language",
        default="eng",
        help="OCR language code (default: eng)"
    )
    
    parser.add_argument(
        "--no-key-detection",
        action="store_true",
        help="Disable automatic key-value pair detection"
    )
    
    parser.add_argument(
        "--no-text-cleaning",
        action="store_true",
        help="Disable text cleaning and normalization"
    )
    
    parser.add_argument(
        "-f", "--format",
        choices=["json", "text"],
        default="json",
        help="Output format (default: json)"
    )
    
    parser.add_argument(
        "--version",
        action="version",
        version="DocuMend OCR CLI v1.0.0"
    )
    
    args = parser.parse_args()
    
    # Run OCR processing
    try:
        result = asyncio.run(process_file(
            file_path=args.file,
            output_path=args.output,
            language=args.language,
            detect_key_values=not args.no_key_detection,
            clean_text=not args.no_text_cleaning,
            format_output=args.format
        ))
        
        print(f"\n✅ Processing completed successfully!")
        print(f"📊 Extracted {result['extracted_data']['text_length']} characters")
        
        if result['extracted_data'].get('key_value_pairs'):
            kv_count = len(result['extracted_data']['key_value_pairs'])
            print(f"🔑 Found {kv_count} types of key-value pairs")
        
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
        
    except ValueError as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
        
    except Exception as e:
        print(f"❌ Processing failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
