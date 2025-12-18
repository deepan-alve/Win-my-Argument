# 🚀 Quick Start - Auto-Update Docker Deployment

## TL;DR

```powershell
# 1. Build & push (local machine)
.\build-and-push.ps1 YOUR_VPS_IP

# 2. Deploy on VPS
git clone https://github.com/deepan-alve/Win-my-Argument.git
cd Win-my-Argument
cp .env.example .env
nano .env  # Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_WS_URL
nano config.toml  # Add API keys
docker-compose up -d

# 3. Make changes & push updates
# Edit code...
.\build-and-push.ps1 YOUR_VPS_IP
# Watchtower auto-deploys in ~5 min! ✨
```

## 🎯 What You Get

- ✅ Pre-built images from GitHub Container Registry
- ✅ Automatic updates every 5 minutes via Watchtower
- ✅ Zero-downtime rolling updates
- ✅ Automatic cleanup of old images
- ✅ No manual docker commands needed

## 📝 Full Instructions

See [UPDATE_SUMMARY.md](./UPDATE_SUMMARY.md) for complete details.
