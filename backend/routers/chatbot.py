from fastapi import APIRouter, Body, HTTPException
from services.chatbot_rag import generate_summary
from pydantic import BaseModel
import json

router = APIRouter()

@router.post("/summarize")
def summarize(content: str = Body(...), template_id: int = Body(...)):
    """Generate summary using templates"""
    try:
        with open("templates/templates.json", "r") as f:
            templates = json.load(f)
        
        template = templates.get(str(template_id), "")
        if not template:
            raise HTTPException(status_code=400, detail="Invalid template ID")
        
        summary = generate_summary(content, template)
        return {"summary": summary}
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Templates file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

@router.get("/health")
def chatbot_health():
    """Health check for chatbot service"""
    return {"status": "healthy", "service": "chatbot"}
