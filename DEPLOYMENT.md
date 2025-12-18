# 🚀 Docker Deployment Guide

Deploy Win-my-Argument on your VPS with automatic updates via Watchtower.

## 📋 Prerequisites

- Docker and Docker Compose installed on VPS
- GitHub Personal Access Token (with `write:packages` permission)
- Your VPS IP address or domain
- Gemini API key

## 🛠️ Quick Start

### On Your Local Machine

1. **Build and push Docker images:**

```powershell
# Windows PowerShell
.\build-and-push.ps1 YOUR_VPS_IP

# Example:
.\build-and-push.ps1 123.45.67.89
```

This script will:
- Login to GitHub Container Registry (ghcr.io)
- Build backend and frontend images
- Push images to ghcr.io/deepan-alve/win-my-argument-backend:latest
- Push images to ghcr.io/deepan-alve/win-my-argument-frontend:latest

Or manually:
```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Build and push backend
docker build -f Dockerfile.backend -t ghcr.io/deepan-alve/win-my-argument-backend:latest .
docker push ghcr.io/deepan-alve/win-my-argument-backend:latest

# Build and push frontend
docker build -f Dockerfile.frontend \
  --build-arg NEXT_PUBLIC_API_URL=http://YOUR_VPS_IP:3001/api \
  --build-arg NEXT_PUBLIC_WS_URL=ws://YOUR_VPS_IP:3001 \
  -t ghcr.io/deepan-alve/win-my-argument-frontend:latest .
docker push ghcr.io/deepan-alve/win-my-argument-frontend:latest
```

### On Your VPS

2. **Clone and configure:**

```bash
git clone https://github.com/deepan-alve/Win-my-Argument.git
cd Win-my-Argument

# Add your Gemini API key
nano config.toml
```

3. **Deploy:**

```bash
docker-compose pull
docker-compose up -d
```

4. **Check status:**

```bash
docker-compose ps
docker-compose logs -f
```

## 🌐 Access Your App

- **Frontend:** `http://YOUR_VPS_IP:3000`
- **Backend API:** `http://YOUR_VPS_IP:3001/api`

## 🔄 Automatic Updates with Watchtower

Watchtower is already included in the docker-compose.yaml and will automatically update your containers when new images are pushed to GitHub Container Registry.

**How it works:**
- Watchtower checks for new images every 5 minutes (300 seconds)
- Automatically pulls and restarts containers with new images
- Cleans up old images to save disk space
- Uses rolling restart to minimize downtime

**Update workflow:**
1. Make code changes locally
2. Run `.\build-and-push.ps1 YOUR_VPS_IP`
3. Watchtower auto-deploys within 5 minutes ✨

**Configuration (already in docker-compose.yaml):**
```yaml
watchtower:
  image: containrrr/watchtower:latest
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  environment:
    - WATCHTOWER_CLEANUP=true
    - WATCHTOWER_POLL_INTERVAL=300
    - WATCHTOWER_INCLUDE_RESTARTING=true
    - WATCHTOWER_ROLLING_RESTART=true
```

Or manually update:
```bash
docker-compose pull && docker-compose up -d
```

## 🔥 Firewall Setup

```bash
# Allow required ports
ufw allow 3000/tcp  # Frontend
ufw allow 3001/tcp  # Backend API
ufw allow 22/tcp    # SSH
ufw enable
```

## 🌍 Domain Setup (Optional)

### With Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

Then rebuild frontend with domain:
```bash
.\build-and-push.ps1 yourdomain.com
```

### With Cloudflare

1. Point your domain to VPS IP
2. Enable proxy (orange cloud)
3. SSL/TLS → Full (strict)
4. Rebuild with `https://yourdomain.com`

## 🐛 Troubleshooting

**Check container health:**
```bash
docker-compose ps
```

**View logs:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f searxng
```

**Restart services:**
```bash
docker-compose restart
```

**Complete reset:**
```bash
docker-compose down -v
docker-compose up -d
```

**Container won't start:**
```bash
# Check if port is in use
netstat -tulpn | grep 3000

# Remove old containers
docker-compose down
docker system prune -a
docker-compose up -d
```

## 📦 Architecture

```
┌─────────────────┐
│   Frontend      │  Port 3000 (Next.js)
│   Container     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend       │  Port 3001 (Node.js + Express)
│   Container     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SearxNG       │  Internal (Search Engine)
│   Container     │
└─────────────────┘
```

## 🔐 Security Notes

- Never commit `config.toml` with API keys
- Use environment variables for sensitive data
- Keep Docker images updated
- Use HTTPS in production
- Configure firewall properly

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Watchtower](https://containrrr.dev/watchtower/)
- [Hetzner Cloud](https://docs.hetzner.com/)
