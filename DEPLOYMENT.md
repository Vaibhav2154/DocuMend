# DocuMend Deployment Guide

## Prerequisites
- GitHub account
- Render account (free)
- Vercel account (free) for frontend

## Backend Deployment on Render

### Step 1: Prepare Your Repository
1. Ensure all files are committed to your GitHub repository
2. The following files should be in your `backend/` directory:
   - `Dockerfile`
   - `render-build.sh`
   - `Procfile`
   - `requirements.txt`
   - `.dockerignore`

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `documend-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `chmod +x ./render-build.sh && ./render-build.sh`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

### Step 3: Environment Variables (if needed)
In Render dashboard, go to your service > Environment and add:
- `GOOGLE_API_KEY`: Your Google Generative AI API key
- `FRONTEND_URL`: Your frontend URL (after deploying frontend)

## Frontend Deployment on Vercel

### Step 1: Build the Frontend
```bash
cd frontend
npm install
npm run build
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Update Environment Variables
In Vercel dashboard, add:
- `NEXT_PUBLIC_API_URL`: Your Render backend URL

## Update CORS After Deployment
1. Get your frontend URL from Vercel
2. Update the `allowed_origins` in `backend/app.py`
3. Redeploy your backend

## Testing Your Deployment
1. Visit your Render backend URL + `/health` to check if it's running
2. Visit your Vercel frontend URL to test the full application
3. Test file upload functionality

## Free Tier Limitations
- **Render Free**: 512MB RAM, sleeps after 15min inactivity
- **Vercel Free**: 100GB bandwidth, 1000 function invocations
- Consider upgrading for production use

## Troubleshooting
- Check Render logs if deployment fails
- Ensure Tesseract is installing correctly in build logs
- Verify CORS settings if frontend can't connect to backend
- Check file upload size limits (Render free tier has limitations)

## Alternative: Docker Deployment
If you prefer Docker, you can also deploy using the included `Dockerfile`:
```bash
docker build -t documend-backend .
docker run -p 8000:8000 documend-backend
```
