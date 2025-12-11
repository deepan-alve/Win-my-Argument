# Docker Files Explained

This project uses Docker to containerize the application. Here's what each file does:

## 📁 File Structure

```
Win-my-Argument/
├── docker-compose.yaml      ← Main file - runs everything
├── Dockerfile.backend       ← Builds backend container
└── Dockerfile.frontend      ← Builds frontend container
```

## 🎯 What Each File Does

### `docker-compose.yaml` (The Main One)
**Purpose:** Orchestrates all services together  
**Use it for:**
- Starting the app: `docker-compose up -d`
- Stopping: `docker-compose down`
- Checking status: `docker-compose ps`
- Viewing logs: `docker-compose logs -f`

This file defines:
- SearxNG (search engine)
- Backend (Node.js API)
- Frontend (Next.js web app)

### `Dockerfile.backend`
**Purpose:** Instructions to build the backend container  
**Contains:** Node.js, TypeScript, Express, API code  
**You don't run this directly** - docker-compose uses it

### `Dockerfile.frontend`
**Purpose:** Instructions to build the frontend container  
**Contains:** Next.js, React, UI code  
**You don't run this directly** - docker-compose uses it

## 🚀 How to Use

### Local Development
```bash
docker-compose up -d
```

### Build and Deploy to VPS
```powershell
.\build-and-push.ps1 YOUR_VPS_IP
```

### On VPS
```bash
git pull
docker-compose pull
docker-compose up -d
```

## 🤔 Why 3 Files?

**Standard Docker practice:**
- 1 docker-compose.yaml = orchestrate multiple services
- 1 Dockerfile per service = how to build each container

**Think of it like:**
- docker-compose.yaml = conductor
- Dockerfiles = sheet music for each instrument

You only interact with `docker-compose.yaml` - the rest are automatic!
