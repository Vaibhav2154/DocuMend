import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import tempfile
import os
import shutil
import asyncio
import re
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, List, Any, Optional
import json
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class OCRService:
    def __init__(self, language: str = "eng"):
        self.language = language
        self.configure_tesseract()
        self.configure_genai()
    
    def configure_genai(self):
        """Configure Google Generative AI"""
        try:
            genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        except Exception as e:
            print(f"Warning: Could not configure GenAI: {e}")
            self.model = None
    
    def configure_tesseract(self):
        """Configure tesseract path for different environments"""
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

    def clean_text(self, text: str) -> str:
        """Clean extracted text by removing extra spaces and line breaks"""
        if not text:
            return ""
        
        # Remove extra whitespace and normalize line breaks
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n\s*\n', '\n', text)
        text = text.strip()
        
        # Remove special characters that might interfere with processing
        text = re.sub(r'[^\w\s\.\,\:\;\-\(\)\[\]\/\@\#\$\%\&\*\+\=\?\!\<\>\|\{\}\"\']', '', text)
        
        return text

    def detect_key_value_pairs(self, text: str) -> Dict[str, Any]:
        """Detect common key-value pairs in the text"""
        key_values = {}
        
        # Date patterns
        date_patterns = [
            r'(?:date|dated?|on)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})',
            r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})',
            r'(?:date|dated?|on)\s*:?\s*(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{2,4})',
        ]
        
        for pattern in date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                key_values["dates"] = list(set(matches))
                break
        
        # Amount/Total patterns
        amount_patterns = [
            r'(?:total|amount|sum|grand\s+total|subtotal)\s*:?\s*\$?(\d+[\.\,]?\d*)',
            r'\$\s*(\d+[\.\,]?\d+)',
            r'(?:price|cost|fee|charge)\s*:?\s*\$?(\d+[\.\,]?\d*)',
        ]
        
        amounts = []
        for pattern in amount_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            amounts.extend(matches)
        
        if amounts:
            key_values["amounts"] = list(set(amounts))
        
        # Invoice/Reference numbers
        ref_patterns = [
            r'(?:invoice|ref|reference|order|id|number)\s*:?\s*#?([A-Z0-9\-]+)',
            r'#([A-Z0-9\-]{3,})',
        ]
        
        references = []
        for pattern in ref_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            references.extend(matches)
        
        if references:
            key_values["reference_numbers"] = list(set(references))
        
        # Email addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            key_values["emails"] = list(set(emails))
        
        # Phone numbers
        phone_pattern = r'(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        phones = re.findall(phone_pattern, text)
        if phones:
            key_values["phone_numbers"] = [f"({area}){exchange}-{number}" for area, exchange, number in phones]
        
        # Names (after titles)
        name_pattern = r'(?:mr|mrs|ms|dr|prof)\.\s+([A-Z][a-z]+\s+[A-Z][a-z]+)'
        names = re.findall(name_pattern, text, re.IGNORECASE)
        if names:
            key_values["names"] = list(set(names))
        
        return key_values

    def extract_text_from_image(self, image_path: str) -> str:
        """Extract text from a single image"""
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image, lang=self.language)
            return text
        except pytesseract.TesseractNotFoundError:
            raise Exception("Tesseract OCR is not installed or not found in PATH.")
        except Exception as e:
            raise Exception(f"Error extracting text from image: {str(e)}")

    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF by converting to images"""
        try:
            images = convert_from_path(pdf_path)
            full_text = ""
            for img in images:
                text = pytesseract.image_to_string(img, lang=self.language)
                full_text += text + "\n"
            return full_text.strip()
        except pytesseract.TesseractNotFoundError:
            raise Exception("Tesseract OCR is not installed or not found in PATH.")
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")

    def llm_enhanced_parsing(self, text: str, parsing_type: str = "general") -> Dict[str, Any]:
        """Use LLM to intelligently parse and structure the extracted text"""
        if not self.model:
            return {"error": "LLM not configured"}
        
        # Define parsing templates based on document type
        parsing_templates = {
            "invoice": {
                "document_type": "invoice/receipt",
                "vendor_info": {
                    "name": "",
                    "address": "",
                    "phone": "",
                    "email": "",
                    "tax_id": ""
                },
                "customer_info": {
                    "name": "",
                    "address": "",
                    "phone": "",
                    "email": ""
                },
                "invoice_details": {
                    "invoice_number": "",
                    "date": "",
                    "due_date": "",
                    "po_number": ""
                },
                "line_items": [],
                "totals": {
                    "subtotal": "",
                    "tax": "",
                    "total": "",
                    "amount_paid": "",
                    "balance_due": ""
                }
            },
            "identity": {
                "document_type": "identity_document",
                "personal_info": {
                    "full_name": "",
                    "first_name": "",
                    "last_name": "",
                    "date_of_birth": "",
                    "place_of_birth": "",
                    "nationality": "",
                    "gender": ""
                },
                "document_details": {
                    "document_number": "",
                    "document_type": "",
                    "issuing_authority": "",
                    "issue_date": "",
                    "expiry_date": ""
                },
                "address": {
                    "street": "",
                    "city": "",
                    "state": "",
                    "country": "",
                    "postal_code": ""
                }
            },
            "financial": {
                "document_type": "financial_document",
                "account_info": {
                    "account_holder": "",
                    "account_number": "",
                    "routing_number": "",
                    "institution_name": ""
                },
                "transaction_details": {
                    "transaction_id": "",
                    "date": "",
                    "amount": "",
                    "currency": "",
                    "description": "",
                    "reference_number": ""
                },
                "balances": {
                    "opening_balance": "",
                    "closing_balance": "",
                    "available_balance": ""
                },
                "period": {
                    "from_date": "",
                    "to_date": ""
                }
            },
            "general": {
                "document_type": "",
                "key_entities": {
                    "names": [],
                    "organizations": [],
                    "locations": [],
                    "dates": [],
                    "amounts": [],
                    "contact_info": {
                        "emails": [],
                        "phones": [],
                        "addresses": []
                    }
                },
                "main_content": {
                    "summary": "",
                    "key_points": [],
                    "action_items": []
                },
                "metadata": {
                    "language": "",
                    "confidence_score": ""
                }
            }
        }
        
        template_structure = parsing_templates.get(parsing_type, parsing_templates["general"])
        
        prompt = f"""
        You are an expert document analyzer. Extract information from the following text and return ONLY a valid JSON object.

        Return the information in this exact JSON structure (fill empty strings with actual values if found, otherwise leave empty):
        {json.dumps(template_structure, indent=2)}

        Rules:
        1. Return ONLY valid JSON, no explanations or additional text
        2. Use empty strings "" for missing text values
        3. Use empty arrays [] for missing list values
        4. Be conservative - only extract information you are confident about
        5. For amounts, include currency symbols if present
        6. For dates, preserve the original format found in the document

        Document text to analyze:
        {text[:2000]}  # Limit text to prevent token overflow
        """
        
        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean the response - remove any markdown code blocks
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            # Try to parse the response as JSON
            result = json.loads(response_text)
            
            # Validate that the result has the expected structure
            if isinstance(result, dict):
                return result
            else:
                return {
                    "error": "LLM returned invalid structure",
                    "fallback_data": template_structure
                }
                
        except json.JSONDecodeError as e:
            # If JSON parsing fails, try to extract JSON from the response
            try:
                # Look for JSON-like content between curly braces
                import re
                json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
                if json_match:
                    json_str = json_match.group(0)
                    result = json.loads(json_str)
                    return result
                else:
                    raise json.JSONDecodeError("No JSON found", "", 0)
            except:
                return {
                    "error": "Failed to parse LLM response as JSON",
                    "raw_response": response.text[:500] if hasattr(response, 'text') else str(response)[:500],
                    "fallback_data": template_structure
                }
        except Exception as e:
            return {
                "error": f"LLM processing error: {str(e)}",
                "fallback_data": template_structure
            }

    def intelligent_document_classification(self, text: str) -> str:
        """Use LLM to classify document type for better parsing"""
        if not self.model:
            return "general"
        
        prompt = f"""
        Analyze the following text and classify it into exactly one of these document types. 
        Respond with only the single word classification, nothing else.

        Document types:
        - invoice (for invoices, receipts, bills, fee receipts)
        - identity (for ID cards, passports, driver's licenses)
        - financial (for bank statements, financial reports)
        - general (for any other document type)

        Text to classify:
        {text[:500]}
        
        Classification:"""
        
        try:
            response = self.model.generate_content(prompt)
            classification = response.text.strip().lower()
            
            # Extract just the classification word if there's extra text
            words = classification.split()
            for word in words:
                if word in ["invoice", "identity", "financial", "general"]:
                    return word
            
            # If none of the expected words found, return general
            return "general"
            
        except Exception as e:
            print(f"Classification error: {e}")
            return "general"

    async def process_image(self, image_path: str, detect_key_values: bool = True, clean_text: bool = True, use_llm: bool = False) -> Dict[str, Any]:
        """Process image file and return structured data with direct LLM analysis"""
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as executor:
            raw_text = await loop.run_in_executor(executor, self.extract_text_from_image, image_path)
        
        result = {
            "raw_text": raw_text,
            "processed_text": self.clean_text(raw_text) if clean_text else raw_text,
            "text_length": len(raw_text),
            "processing_timestamp": datetime.utcnow().isoformat()
        }
        
        # Skip traditional parsing, go directly to LLM analysis
        if raw_text.strip():
            text_to_analyze = result["processed_text"] if clean_text else raw_text
            document_type = self.intelligent_document_classification(text_to_analyze)
            result["llm_analysis"] = {
                "document_classification": document_type,
                "structured_data": self.llm_enhanced_parsing(text_to_analyze, document_type)
            }
        
        return result

    async def process_pdf(self, pdf_path: str, detect_key_values: bool = True, clean_text: bool = True, use_llm: bool = False) -> Dict[str, Any]:
        """Process PDF file and return structured data with direct LLM analysis"""
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as executor:
            raw_text = await loop.run_in_executor(executor, self.extract_text_from_pdf, pdf_path)
        
        result = {
            "raw_text": raw_text,
            "processed_text": self.clean_text(raw_text) if clean_text else raw_text,
            "text_length": len(raw_text),
            "processing_timestamp": datetime.utcnow().isoformat()
        }
        
        # Skip traditional parsing, go directly to LLM analysis
        if raw_text.strip():
            text_to_analyze = result["processed_text"] if clean_text else raw_text
            document_type = self.intelligent_document_classification(text_to_analyze)
            result["llm_analysis"] = {
                "document_classification": document_type,
                "structured_data": self.llm_enhanced_parsing(text_to_analyze, document_type)
            }
        
        return result

# Legacy functions for backward compatibility
async def extract_text_from_pdf_async(file_path: str) -> str:
    """Legacy function for backward compatibility"""
    ocr_service = OCRService()
    return await ocr_service.process_pdf(file_path, detect_key_values=False, clean_text=False)
