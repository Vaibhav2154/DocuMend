import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

def generate_summary(text: str, template: str) -> str:
    prompt = f"Summarize the following handwritten content using this format:\n{template}\n\nContent:\n{text}"
    response = model.generate_content(prompt)
    return response.text.strip()
