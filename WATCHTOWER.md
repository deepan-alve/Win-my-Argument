# 🔄 Watchtower Auto-Update Guide

This project uses **Watchtower** to automatically update Docker containers when new images are pushed to GitHub Container Registry.

## 🎯 How It Works

1. **You push code changes** to your repository
2. **Run the build script** to create and push new Docker images
3. **Watchtower detects** the new images (checks every 5 minutes)
4. **Containers auto-update** with zero manual intervention

## 🚀 Quick Start

### First Time Setup

```bash
# On your VPS
git clone https://github.com/deepan-alve/Win-my-Argument.git
cd Win-my-Argument

# Configure your API keys
nano config.toml

# Login to GitHub Container Registry (if images are private)
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Start everything (including Watchtower)
docker-compose up -d
```

### Pushing Updates

```powershell
# On your local machine (Windows)
.\build-and-push.ps1 YOUR_VPS_IP

# This will:
# 1. Build backend image
# 2. Build frontend image with your VPS URL
# 3. Push both to ghcr.io
# 4. Watchtower will auto-deploy within 5 minutes
```

## ⚙️ Watchtower Configuration

Current settings in `docker-compose.yaml`:

```yaml
watchtower:
  image: containrrr/watchtower:latest
  environment:
    - WATCHTOWER_CLEANUP=true          # Remove old images
    - WATCHTOWER_POLL_INTERVAL=300     # Check every 5 minutes
    - WATCHTOWER_INCLUDE_RESTARTING=true
    - WATCHTOWER_ROLLING_RESTART=true  # Minimize downtime
```

## 📊 Monitoring Watchtower

```bash
# View Watchtower logs
docker logs -f win-my-argument-watchtower

# Check if containers were updated
docker-compose ps

# View update history
docker logs win-my-argument-watchtower | grep "Updated"
```

## 🛠️ Manual Updates (if needed)

```bash
# Force pull and restart
docker-compose pull
docker-compose up -d

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

## 🔐 GitHub Container Registry Access

### For Public Images
No authentication needed on VPS.

### For Private Images
```bash
# Create GitHub Personal Access Token with 'read:packages' permission
# Then login on your VPS:
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

## 🎮 Common Commands

```bash
# Check all containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Start everything
docker-compose up -d

# Rebuild and restart (if docker-compose.yaml changed)
docker-compose up -d --force-recreate
```

## ⏱️ Update Timeline

| Action | Time | Where |
|--------|------|-------|
| Code changes | Instant | Local machine |
| Build & push images | 2-5 min | Local machine |
| Watchtower detects | 0-5 min | VPS |
| Container update | 10-30 sec | VPS |
| **Total** | **~5-10 min** | **End to end** |

## 🔍 Troubleshooting

### Images not updating?

```bash
# Check Watchtower logs
docker logs win-my-argument-watchtower

# Verify image exists on GitHub
# Visit: https://github.com/deepan-alve?tab=packages

# Manual pull to test
docker pull ghcr.io/deepan-alve/win-my-argument-backend:latest
```

### Watchtower not running?

```bash
# Restart Watchtower
docker-compose restart watchtower

# Or recreate it
docker-compose up -d watchtower
```

### Need faster updates?

Edit `docker-compose.yaml` and change:
```yaml
WATCHTOWER_POLL_INTERVAL=60  # Check every minute
```

Then restart:
```bash
docker-compose up -d watchtower
```

## 🎯 Best Practices

1. **Always test locally** before pushing to production
2. **Use semantic versioning** tags (e.g., `v1.0.0`) for major releases
3. **Monitor logs** during first few updates
4. **Keep config.toml** backed up
5. **Set up health checks** (already configured)

## 🚨 Emergency Rollback

If an update breaks something:

```bash
# Stop containers
docker-compose down

# Pull previous version (if tagged)
docker pull ghcr.io/deepan-alve/win-my-argument-backend:v1.0.0
docker pull ghcr.io/deepan-alve/win-my-argument-frontend:v1.0.0

# Or rebuild from specific commit
git checkout <previous-commit>
docker-compose build
docker-compose up -d
```

## 📚 Additional Resources

- [Watchtower Documentation](https://containrrr.dev/watchtower/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
