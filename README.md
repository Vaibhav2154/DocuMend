# DocuMend - OCR-to-JSON Parser

> **⚠️ Performance Note:** Since Tesseract OCR is deployed on Render's free tier with limited hardware resources, PDF text extraction may take significantly longer than expected. For a demonstration of the application's full functionality, please watch this demo video: [DocuMend Demo](https://drive.google.com/file/d/1byCUJWrFqmBaTPwT03-j3Ff4R16t5LUW/view?usp=sharing)

DocuMend is an advanced **OCR-to-JSON Parser** that extracts text from images and PDFs, then returns structured JSON output with AI-powered analysis. The application also includes a secondary PDF summarization feature for comprehensive document processing.

## Assignment Overview

This project fulfills the **OCR-to-JSON Parser Assignment** requirements:

### ✅ Assignment Requirements Met

1. **Upload Input Support**:
   - ✅ JPG and PNG image formats
   - ✅ **Bonus**: Scanned PDFs

2. **OCR Implementation**:
   - ✅ Tesseract OCR engine integration
   - ✅ Accurate text extraction from documents

3. **Output Format**:
   - ✅ Structured JSON output
   - ✅ Clean and accurate text extraction

4. **Interface**:
   - ✅ Modern web-based interface
   - ✅ Built with Next.js + TypeScript + Tailwind CSS

### 🌟 Bonus Features Implemented

- ✅ **Advanced Text Cleaning**: Removes extra spaces, line breaks, normalizes text
- ✅ **Key-Value Pair Detection**: Automatically identifies dates, amounts, invoice numbers, emails, phone numbers, names
- ✅ **Multi-language Support**: 13+ languages supported with OCR language packs
- ✅ **AI Enhancement**: Google Gemini AI for intelligent document analysis and classification
- ✅ **Download Options**: Export results as JSON files

## 🚀 Live Demo

- **GitHub Repository**: [https://github.com/yourusername/DocuMend](https://github.com/yourusername/DocuMend)
- **Live Application**: [https://documend-frontend.vercel.app](https://documend-frontend.vercel.app)
- **Backend API**: [https://documend-backend.onrender.com](https://documend-backend.onrender.com)

## Features

### 🚀 Primary Feature: OCR-to-JSON Parser

- **Multi-format Support**: Processes JPG, PNG, and PDF files
- **Advanced OCR Technology**: Uses Tesseract OCR engine for accurate text extraction
- **AI-Enhanced Analysis**: Google Gemini AI for intelligent document analysis
- **Key-Value Detection**: Automatically identifies dates, amounts, invoice numbers, emails, phone numbers, and names
- **Document Classification**: Intelligent categorization (invoice, identity, financial, general)
- **Text Cleaning**: Removes extra spaces, line breaks, and normalizes text
- **Multi-language Support**: Supports 13+ languages including English, French, German, Spanish, Chinese, Japanese, and more
- **Structured JSON Output**: Returns clean, structured JSON with extracted data and metadata
- **Real-time Processing**: Fast extraction with progress tracking
- **Export Options**: Download results as JSON files

### 📄 Secondary Feature: PDF Summarization

- **PDF Validation**: Ensures uploaded files are valid PDFs
- **Text Extraction**: Extracts text from PDF documents using Tesseract OCR
- **AI Summarization**: Utilizes Google Generative AI to summarize the extracted text
- **Multiple Templates**: Various summary formats (Executive, Technical, Business, Academic, General)
- **Download Options**: Export summaries as Word documents or PDFs

## Tech Stack

### Backend

-   **Framework**: FastAPI
-   **Language**: Python
-   **Key Libraries**:
    -   `uvicorn`: ASGI server
    -   `python-multipart`: For file uploads
    -   `pytesseract`: OCR for text extraction
    -   `pdf2image`: Converts PDF pages to images
    -   `python-dotenv`: Environment variable management
    -   `google-generativeai`: For summarization
    -   `Pillow`: Image processing
    -   `requests`: HTTP requests

### Frontend

-   **Framework**: Next.js
-   **Language**: TypeScript
-   **Key Libraries**:
    -   `react`: UI library
    -   `tailwindcss`: CSS framework
    -   `shadcn/ui`: UI components
    -   `axios` (or `fetch`): HTTP client for API communication
    -   `react-hook-form`: Form handling
    -   `zod`: Schema validation

## Project Structure

```
DocuMend/
├── backend/
│   ├── app.py              # FastAPI application
│   ├── Dockerfile          # Docker configuration
│   ├── Procfile            # Heroku/Render process file
│   ├── render-build.sh     # Build script for Render
│   ├── requirements.txt    # Python dependencies
│   ├── routers/            # API route handlers
│   │   ├── chatbot.py      # Summarization endpoints
│   │   ├── ocr.py          # OCR-to-JSON endpoints  
│   │   └── validate.py     # PDF validation endpoints
│   ├── services/           # Business logic
│   │   ├── chatbot_rag.py  # RAG-based chatbot service
│   │   ├── image_validation.py # Legacy PDF processing
│   │   └── ocr_service.py  # OCR processing service
│   ├── templates/          # Response templates
│   └── utils/              # Utility functions
├── frontend/
│   ├── app/                # Next.js app directory
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx        # PDF Summarizer page
│   │   └── ocr/
│   │       └── page.tsx    # OCR-to-JSON Parser page
│   ├── components/         # React components
│   │   ├── navigation.tsx  # Shared navigation component
│   │   └── ui/             # shadcn/ui components
│   ├── public/             # Static assets
│   ├── next.config.js      # Next.js configuration
│   ├── package.json        # Node.js dependencies
│   └── tsconfig.json       # TypeScript configuration
├── DEPLOYMENT.md           # Deployment instructions
├── render.yaml             # Render deployment configuration
└── README.md               # This file
```

## Getting Started

### Prerequisites

-   Node.js and npm (or yarn)
-   Python 3.7+ and pip
-   Tesseract OCR installed on your system
-   Google Generative AI API Key

### Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
2.  **Create and activate a virtual environment** (recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set up environment variables**:
    Create a `.env` file in the `backend` directory and add your Google API key:
    ```
    GOOGLE_API_KEY=your_google_api_key
    ```
5.  **Run the backend server**:
    ```bash
    uvicorn app:app --reload
    ```
    The backend will be accessible at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Run the frontend development server**:
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The frontend will be accessible at `http://localhost:3000`.

## Deployment

Detailed deployment instructions for Render (backend) and Vercel (frontend) can be found in `DEPLOYMENT.md`.

The `render.yaml` file is provided for easy deployment to Render.

## API Endpoints

The backend API (`app.py`) exposes the following main endpoints:

-   `GET /`: Root endpoint with API information.
-   `POST /validate/pdf`: Validates and extracts text from an uploaded PDF.
-   `POST /summarize/summarize`: Summarizes the provided text.
-   `GET /summarize/health`: Health check for the summarization service.

Refer to the FastAPI documentation (usually at `/docs` or `/redoc` on the running backend server) for a detailed API specification.

## Scripts

### Frontend (`package.json`)

-   `dev`: Starts the Next.js development server.
-   `build`: Builds the Next.js application for production.
-   `start`: Starts the Next.js production server.
-   `lint`: Lints the codebase.
-   `export`: Exports the Next.js application as static HTML.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
