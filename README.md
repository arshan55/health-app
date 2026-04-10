# NutriGuide AI 🥗

A high-performance, AI-powered health & nutrition assistant built with **FastAPI** + **Next.js**, deployable to **Google Cloud Run**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Backend | FastAPI (Python 3.11) |
| AI | Google Gemini 1.5 Flash/Pro |
| Auth | JWT (python-jose + bcrypt) |
| Database | SQLite (local) / Cloud SQL PostgreSQL (prod) |
| Deployment | GCP Cloud Run + Cloud Build |

---

## Prerequisites

- Node.js v18+
- Python v3.11+
- Git

---

## Quick Start (Local Development)

### 1. Set up environment variables

```powershell
# Copy the example env file
Copy-Item .env.example .env
# Then edit .env and add your GEMINI_API_KEY
# Get one free at: https://aistudio.google.com/app/apikey
```

### 2. Run the Backend (FastAPI)

Open **Terminal 1**:

```powershell
cd "c:\Arshan\Projects\Health web app\backend"

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend
python -m uvicorn main:app --reload --port 8000
```

> API available at `http://localhost:8000` — Swagger docs at `http://localhost:8000/docs`

### 3. Run the Frontend (Next.js)

Open **Terminal 2**:

```powershell
cd "c:\Arshan\Projects\Health web app\frontend"

npm install
npm run dev
```

> App available at `http://localhost:3000`

---

## Deployment to GCP Cloud Run

### Prerequisites

1. **GCP Project** with billing enabled
2. **APIs enabled:**
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com containerregistry.googleapis.com
   ```

3. **Create secrets in Secret Manager:**
   ```bash
   echo -n "your_secret_key_here" | gcloud secrets create nutriguide-secret-key --data-file=-
   echo -n "your_gemini_api_key" | gcloud secrets create nutriguide-gemini-key --data-file=-
   ```

4. **Grant Cloud Build access to secrets:**
   ```bash
   # Get your project number
   gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)"

   # Grant access (replace PROJECT_NUMBER)
   gcloud secrets add-iam-policy-binding nutriguide-secret-key \
     --member="serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"

   gcloud secrets add-iam-policy-binding nutriguide-gemini-key \
     --member="serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   ```

### Deploy

From the project root:

```bash
gcloud builds submit --config cloudbuild.yaml
```

This will:
1. Build & push the backend Docker image → deploy to Cloud Run
2. Build the frontend (with backend URL baked in) → deploy to Cloud Run

> ⚠️ **Note:** The default deployment uses SQLite which is ephemeral on Cloud Run (data resets on restart). For persistent production data, switch `DATABASE_URL` to a Cloud SQL PostgreSQL instance.

---

## Environment Variables Reference

| Variable | Used By | Description |
|---|---|---|
| `DATABASE_URL` | Backend | SQLite (local) or PostgreSQL connection string |
| `SECRET_KEY` | Backend | JWT signing secret |
| `GEMINI_API_KEY` | Backend | Google Gemini API key |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API base URL |
