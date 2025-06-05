from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import validate, chatbot
import os

app = FastAPI(title="DocuMend")

# Configure CORS for production
allowed_origins = [
    "*"  # Replace with your actual frontend URL
]



app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(validate.router, prefix="/validate", tags=["Validation"])
app.include_router(chatbot.router, prefix="/chatbot", tags=["Summarization"])

@app.get("/")
def root():
    return {"message": "CivicEye AI is running."}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "DocuMend API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
