# Use official lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Cloud Run injects secrets as env vars — declare them so they're visible at runtime
# (actual values are injected by Cloud Run, not baked into the image)
ENV PORT=8080
ENV DATABASE_URL=sqlite+aiosqlite:///./nutriguide.db

EXPOSE 8080

# Run uvicorn on the PORT Cloud Run provides
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]
