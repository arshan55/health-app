#!/bin/bash

# Simple GCP Deployment Script for Cloud Shell
# Run this inside Google Cloud Shell

echo "Starting NutriGuide AI deployment..."

# 1. Enable needed APIs
echo "Enabling APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com

# 2. Setup Secrets
echo "Setting up Secrets (using your .env values)..."

# Create secrets if they don't exist
gcloud secrets create nutriguide-gemini-key || echo "Secret already exists"
gcloud secrets create nutriguide-secret-key || echo "Secret already exists"

# Add versions (inserting the keys you provided)
echo "AIzaSyAwSNR6SVeKtyhlXeGN_5MxujblfcgPcJE" | gcloud secrets versions add nutriguide-gemini-key --data-file=-
echo "nutriguide_jwt_secret_k3y_retro_2026_xZ9#mQ!pL" | gcloud secrets versions add nutriguide-secret-key --data-file=-

# 3. Grant Secret Manager access to Cloud Build service account
PROJECT_NUMBER=$(gcloud projects describe $GOOGLE_CLOUD_PROJECT --format="value(projectNumber)")
gcloud projects add-iam-policy-binding $GOOGLE_CLOUD_PROJECT \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 4. Run Cloud Build
echo "Submitting to Cloud Build..."
gcloud builds submit --config cloudbuild.yaml .

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "Find your Frontend URL in the Cloud Run console."
echo "========================================="
