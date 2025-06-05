import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def generate_summary(content: str, template: str) -> str:
    """Generate summary using the template"""
    prompt = f"""
    Please summarize the following content according to this template:
    
    Template: {template}
    
    Content: {content}
    
    Summary:
    """
    
    try:
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating summary: {str(e)}"