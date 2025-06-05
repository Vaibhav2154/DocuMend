from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import validate, chatbot
import os

app = FastAPI(
    title="DocuMend API",
    description="PDF processing and summarization service",
    version="1.0.0",
)

# Configure CORS
allowed_origins = [
    "http://localhost:3000",  # Next.js dev server
    "http://127.0.0.1:3000",
    "*"  # Remove in production and specify exact origins
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(validate.router, prefix="/validate", tags=["PDF Validation"])
app.include_router(chatbot.router, prefix="/summarize", tags=["Summarization"])

@app.get("/")
def root():
    return {
        "message": "DocuMend API - PDF Processing and Summarization",
        "endpoints": {
            "pdf_extraction": "/validate/pdf",
            "summarization": "/summarize/summarize",
            "health": "/summarize/health"
        }
    }
