from fastapi import APIRouter, Body
from services.chatbot_rag import generate_summary
import json

router = APIRouter()

@router.post("/summarize")
def summarize(content: str = Body(...), template_id: int = Body(...)):
    with open("templates/templates.json", "r") as f:
        templates = json.load(f)
    template = templates.get(str(template_id), "")
    if not template:
        return {"error": "Invalid template ID"}
    summary = generate_summary(content, template)
    return {"summary": summary}
