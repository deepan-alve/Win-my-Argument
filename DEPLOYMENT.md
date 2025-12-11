# Docker Deployment Guide

## Prerequisites
- Docker and Docker Compose installed on your VPS
- Watchtower running for auto-updates
- Your VPS domain or IP address

## Setup Steps

### 1. Clone the repository on your VPS
```bash
git clone https://github.com/deepan-alve/Win-my-Argument.git
cd Win-my-Argument
```

### 2. Configure environment variables
```bash
# Copy the example file
cp .env.example .env

# Edit with your VPS domain or IP
nano .env
```

Update the values:
```
NEXT_PUBLIC_API_URL=http://YOUR_VPS_IP:3001/api
NEXT_PUBLIC_WS_URL=ws://YOUR_VPS_IP:3001
```

### 3. Update config.toml
Ensure your Gemini API key is in `config.toml`:
```toml
[API_KEYS]
GEMINI = "AIzaSyAN1tMhcOEglx4Nw0SxjDsAX9v3kPJqnKg"
```

### 4. Build and push images to Docker Hub (from your local machine)

```bash
# Login to Docker Hub
docker login

# Build and push backend
docker build -f backend.dockerfile -t deepanalve/win-my-argument-backend:latest .
docker push deepanalve/win-my-argument-backend:latest

# Build frontend with production URLs
docker build -f app.dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=http://YOUR_VPS_IP:3001/api \
  --build-arg NEXT_PUBLIC_WS_URL=ws://YOUR_VPS_IP:3001 \
  -t deepanalve/win-my-argument-frontend:latest .
docker push deepanalve/win-my-argument-frontend:latest
```

### 5. Deploy on VPS

On your VPS, create a `docker-compose.yaml`:
```yaml
version: '3.8'

services:
  searxng:
    image: docker.io/searxng/searxng:latest
    volumes:
      - ./searxng:/etc/searxng:rw
    ports:
      - 4000:8080
    networks:
      - perplexica-network
    restart: unless-stopped

  perplexica-backend:
    image: deepanalve/win-my-argument-backend:latest
    environment:
      - SEARXNG_API_URL=http://searxng:8080
    depends_on:
      - searxng
    ports:
      - 3001:3001
    volumes:
      - backend-dbstore:/home/perplexica/data
      - uploads:/home/perplexica/uploads
      - ./config.toml:/home/perplexica/config.toml
    networks:
      - perplexica-network
    restart: unless-stopped

  perplexica-frontend:
    image: deepanalve/win-my-argument-frontend:latest
    depends_on:
      - perplexica-backend
    ports:
      - 3000:3000
    networks:
      - perplexica-network
    restart: unless-stopped

networks:
  perplexica-network:

volumes:
  backend-dbstore:
  uploads:
```

### 6. Start the services
```bash
docker-compose up -d
```

### 7. Check logs
```bash
docker-compose logs -f
```

## Watchtower Configuration

Your friend's Watchtower should be configured to watch these images:
```yaml
watchtower:
  image: containrrr/watchtower
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  command: --interval 300 --cleanup
  restart: unless-stopped
```

Watchtower will automatically pull and deploy new versions when you push to Docker Hub.

## Updating the Application

To deploy updates:
1. Make changes locally
2. Build and push new images to Docker Hub
3. Watchtower will automatically pull and restart containers within 5 minutes

Or manually:
```bash
docker-compose pull
docker-compose up -d
```

## Accessing the Application

- Frontend: `http://YOUR_VPS_IP:3000`
- Backend API: `http://YOUR_VPS_IP:3001/api`
- SearxNG: `http://YOUR_VPS_IP:4000`

## Firewall Configuration

Make sure these ports are open on your VPS:
```bash
ufw allow 3000/tcp  # Frontend
ufw allow 3001/tcp  # Backend
ufw allow 4000/tcp  # SearxNG (optional, only if you want external access)
```

## Using with a Domain

If you have a domain, set up nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

Then update your frontend build args to use `https://yourdomain.com` instead of the IP.

## Troubleshooting

Check container status:
```bash
docker-compose ps
```

View logs:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs searxng
```

Restart services:
```bash
docker-compose restart
```

Rebuild from scratch:
```bash
docker-compose down -v
docker-compose up -d --build
```
