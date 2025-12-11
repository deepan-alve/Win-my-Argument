# Docker Compose Configuration

This file orchestrates three services for Win-my-Argument:

## Services

### 🔍 SearxNG
- **Purpose:** Privacy-respecting metasearch engine
- **Image:** `searxng/searxng:latest`
- **Port:** Internal only (8080)
- **Volume:** Persistent configuration

### 🔧 Backend
- **Purpose:** Node.js API with Gemini AI integration
- **Image:** `deepanalve/win-my-argument-backend:latest`
- **Port:** 3001 (API + WebSocket)
- **Volumes:** 
  - SQLite database (`backend-data`)
  - File uploads (`uploads-data`)
  - Config file (read-only)

### 🎨 Frontend
- **Purpose:** Next.js web interface
- **Image:** `deepanalve/win-my-argument-frontend:latest`
- **Port:** 3000
- **Environment:** Configurable via build args

## Usage

### Development
```bash
docker-compose up -d
docker-compose logs -f
```

### Production
```bash
# Set environment variables
export NEXT_PUBLIC_API_URL=http://your-vps-ip:3001/api
export NEXT_PUBLIC_WS_URL=ws://your-vps-ip:3001

# Deploy
docker-compose pull
docker-compose up -d
```

### Monitoring
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Restart
docker-compose restart [service-name]
```

### Cleanup
```bash
# Stop and remove
docker-compose down

# Remove volumes too
docker-compose down -v
```

## Health Checks

All services include health checks for reliability:
- **SearxNG:** HTTP check on port 8080
- **Backend:** API endpoint check
- **Frontend:** HTTP check on port 3000

## Networks

All services communicate via the `app-network` bridge network.

## Volumes

- `backend-data`: SQLite database persistence
- `uploads-data`: User file uploads
- `searxng-config`: SearxNG configuration

## Environment Variables

Set these before deploying:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_WS_URL`: Backend WebSocket URL

See `.env.example` for details.
