# Eco Link Enterprise — Deployment & Operations Guide

This document describes the deployment architecture and steps required to run the **Eco Link** platform both locally and in production.

---

## 🏗️ 1. Production Target Architecture

The platform uses a decoupled, highly scalable cloud setup:

```
                    ┌────────────────────────┐
                    │     Vercel Edge CDN    │
                    │   (React Frontend UI)  │
                    └───────────┬────────────┘
                                │
                                ▼ (Secure HTTP / CORS API Requests)
                    ┌────────────────────────┐
                    │     Railway Cloud      │
                    │  (Django Backend REST) │
                    └─────┬────────────┬─────┘
                          │            │
                          ▼ (SQL)      ▼ (Media Uploads)
              ┌──────────────┐      ┌──────────────┐
              │  PostgreSQL  │      │  Cloudinary  │
              │  (Database)  │      │  (SaaS CDN)  │
              └──────────────┘      └──────────────┘
```

* **Frontend**: React 19 + Vite deployed to **Vercel** (static hosting with client-side routing).
* **Backend**: Django REST Framework API engine deployed to **Railway** running in containerized production mode.
* **Database**: **PostgreSQL** hosted on Railway (fully managed database service).
* **Media Storage**: **Cloudinary** CDN service (handles secure image storage and retrieval for waste listings).
* **CI/CD Pipeline**: **GitHub Actions** (builds and pushes Docker images to GitHub Container Registry).

---

## 🐳 2. Local Development (Docker Compose)

To spin up the entire ecosystem locally (database, backend API, and React frontend) using Docker Compose:

### Commands
1. Build and run containers in the background:
   ```bash
   docker compose up --build -d
   ```
2. Check logs:
   ```bash
   docker compose logs -f
   ```
3. Stop services:
   ```bash
   docker compose down
   ```

### Ports and URLs
* **Frontend Portal**: [http://localhost/](http://localhost/) (Port 80)
* **Backend API REST**: [http://localhost:8000/api/](http://localhost:8000/api/)
* **Django Admin**: [http://localhost/admin/](http://localhost/admin/)

---

## 🚀 3. Production Deployment Steps

### Frontend: Vercel
1. Connect your GitHub repository to your Vercel account.
2. Select the repository and configure the project:
   * **Framework Preset**: `Vite` (or `Other`)
   * **Root Directory**: `frontend/`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Add the following **Environment Variable**:
   * `VITE_API_URL`: The URL of your live Railway backend (e.g. `https://your-backend.railway.app`)

---

### Backend & Database: Railway
1. In Railway, click **New Project** and choose **Deploy from GitHub repo**.
2. Select the repository and specify the subfolder root:
   * **Root Directory**: `backend/`
   * *Note: Railway will automatically detect the `Dockerfile` inside `backend/` and build it.*
3. Provision a **PostgreSQL** database service in the same project.
4. Link the database to the Django backend. Railway automatically populates the `DATABASE_URL` variable.
5. Add the remaining required **Environment Variables** in the Railway Dashboard:

| Variable Name | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `DEBUG` | Django debug flag | `False` |
| `SECRET_KEY` | Django cryptographic key | `your-long-secure-random-string` |
| `ALLOWED_HOSTS` | Allowed host headers | `your-backend.railway.app,localhost` |
| `CORS_ALLOW_ALL_ORIGINS`| CORS permission | `True` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary credentials | *Your Cloudinary cloud name* |
| `CLOUDINARY_API_KEY` | Cloudinary credentials | *Your Cloudinary API key* |
| `CLOUDINARY_API_SECRET` | Cloudinary credentials | *Your Cloudinary API secret* |

---

## 🛠️ 4. CI/CD: GitHub Actions Workflow

On every push or pull request to the `main` branch, the workflow `.github/workflows/docker-ci-cd.yml`:
1. Audits code syntax and runs builds.
2. Authenticates with **GitHub Container Registry** (`ghcr.io`).
3. Compiles the frontend and backend Docker images.
4. Publishes tagged images to GHCR for deployment.
