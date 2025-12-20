# Deployment Guide for Coolify

This project is configured to be easily deployed on Coolify using Docker.

## Prerequisites

1.  A Coolify instance.
2.  A Git repository (GitHub, GitLab, etc.) connected to your Coolify instance.

## Deployment Steps

1.  **Push your code** to your Git repository.
2.  **Login to Coolify**.
3.  **Create a New Resource**:
    *   Select **Project** -> **New** -> **Public Repository** (or Private if applicable).
    *   Paste your repository URL.
    *   Select the branch (e.g., `main` or `master`).
4.  **Configuration**:
    *   **Build Pack**: Select `Docker`.
        *   Coolify should automatically detect the `Dockerfile` in the root directory.
    *   **Port**: ensure it is set to `3001` (or whatever `PORT` you set in env vars).
5.  **Environment Variables**:
    *   Go to the **Environment Variables** tab in Coolify for your service.
    *   Add the following variables (copy from your `.env` file):
        *   `DATABASE_URL`: Your PostgreSQL connection string.
        *   `PORT`: `3001` (optional, defaults to 3001).
        *   `NODE_ENV`: `production`
6.  **Deploy**:
    *   Click the **Deploy** button.

## What happens during deployment?

The included `Dockerfile` performs the following steps:
1.  Installs dependencies (`npm install`).
2.  Builds the React frontend (`npm run build`).
3.  Starts the Express server (`npm start`).
    *   The server is configured to serve the built frontend files from the `dist` folder when in production mode.

## Troubleshooting

*   **Database Connection**: Ensure your `DATABASE_URL` is correct and accessible from the Coolify server. If the database is also on Coolify, use the internal network URL provided by Coolify.
*   **Build Errors**: Check the deployment logs in Coolify. Common issues might be missing environment variables during build (though this setup mostly uses them at runtime).
