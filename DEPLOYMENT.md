# Frontend Deployment Guide

This directory contains the React frontend application. It is containerized using Docker and served via Vite Preview.

## Port Configuration

The container is configured to listen on port **9911**.

*   **Internal Port**: `9911`
*   **Docker Expose**: `9911`

## Coolify Deployment Steps

1.  **Repository**: Connect your repository.
2.  **Build Pack**: Select **Docker**.
3.  **Port Configuration**:
    *   **IMPORTANT**: You must set the **Ports Exposes** (or Internal Port) to `9911` in your Coolify service configuration.
    *   If you leave it as default (often 3000 or 80), you will get a **Bad Gateway** error.
4.  **Environment Variables**:
    *   `VITE_API_URL`: URL of your backend API (e.g., `https://api.yourdomain.com`).

## Local Testing with Docker

```bash
# Build the image
docker build -t invoice-frontend .

# Run the container
docker run -p 9911:9911 invoice-frontend
```

Access at `http://localhost:9911`
