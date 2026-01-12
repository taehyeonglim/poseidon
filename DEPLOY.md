# 🚀 POSEIDON Deployment Guide (Render)

This guide explains how to deploy POSEIDON using [Render](https://render.com), a unified cloud to build and run all your apps and websites.

## Prerequisites

- A GitHub account with the POSEIDON repository
- A [Render](https://render.com) account

## Method 1: Blueprint (Recommended)

We have included a `render.yaml` file that defines all services automatically.

1. Go to the [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` configuration.
5. Click **Apply**.

This will deploy:

- **poseidon-api**: The backend API service
- **poseidon-web**: The frontend React static site

## Method 2: Manual Setup

### 1. Backend (Web Service)

- **Name**: `poseidon-api`
- **One and Runtime**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PROVIDER_MODE`: `mock`

### 2. Frontend (Static Site)

- **Name**: `poseidon-web`
- **Build Command**: `cd client && npm install && npm run build`
- **Publish Directory**: `client/dist`
- **Environment Variables**:
  - `VITE_API_URL`: (Paste the URL of your deployed poseidon-api here)

## Verification

Once deployed:

1. Open the frontend URL provided by Render.
2. Try searching for "collaborative learning".
3. Verify that results appear (connection to backend is working).
