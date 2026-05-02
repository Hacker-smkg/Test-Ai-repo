# SentiOCR — Advanced Handwritten Sentiment Analysis

**Live Site:** [https://frontend-p31ck0s0k-hackersmkgs-projects.vercel.app](https://frontend-p31ck0s0k-hackersmkgs-projects.vercel.app)

SentiOCR is a high-performance, full-stack AI platform designed to bridge the gap between physical handwriting and digital emotional intelligence. It leverages OpenCV-enhanced OCR to extract text from handwritten images and applies a weighted fuzzy-matching algorithm against a dynamic SQLite sentiment dictionary to classify emotional tone.

## 🚀 Features
- **OCR Engine**: OpenCV-preprocessed Tesseract OCR for high-accuracy text extraction.
- **Sentiment Logic**: Multi-weighted sentiment scoring with fuzzy word matching.
- **Dynamic Dictionary**: Manage positive, negative, and neutral keywords via the UI.
- **Modern UI**: Responsive React + TypeScript frontend with drag-and-drop support.

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI, SQLAlchemy (SQLite), Pytesseract, OpenCV.
- **Deployment**: Vercel (Frontend) & Render (Backend).

## 📦 Installation & Setup

### 1. Backend (Python)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment Instructions

### Frontend (Vercel)
1. Connect your GitHub repository to **Vercel**.
2. Set the **Root Directory** to `frontend`.
3. Add Environment Variable: `VITE_API_URL` = (Your Render Backend URL).
4. Deploy.

### Backend (Render)
1. Create a **Web Service** on Render.
2. Set the **Root Directory** to `backend`.
3. Environment: **Docker** (This is critical to ensure Tesseract OCR is installed).
4. Render will automatically detect the `Dockerfile` and build the image.

## 📜 License
MIT
