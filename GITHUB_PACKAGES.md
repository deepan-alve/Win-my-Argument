# GitHub Container Registry Setup

Using GHCR (GitHub Container Registry) instead of Docker Hub for Watchtower auto-deployment.

## 🔑 Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name it: `Docker Registry Access`
4. Set expiration: **No expiration** (or 1 year)
5. Select scopes:
   - ✅ `write:packages` (Upload packages)
   - ✅ `read:packages` (Download packages)
   - ✅ `delete:packages` (Delete packages)
6. Click **"Generate token"**
7. **Copy the token** (you won't see it again!)

Example token: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 📦 Make Packages Public

After first push, make images public so Watchtower can pull without authentication:

1. Go to https://github.com/deepan-alve?tab=packages
2. Click on **win-my-argument-backend**
3. Click **"Package settings"** (right side)
4. Scroll to **"Danger Zone"**
5. Click **"Change visibility"** → **Public** → Confirm
6. Repeat for **win-my-argument-frontend**

## 🚀 Build and Push

```powershell
# Login to GHCR (use your GitHub username and PAT)
docker login ghcr.io
# Username: deepan-alve
# Password: <paste your PAT token>

# Build and push
.\build-and-push.ps1 YOUR_VPS_IP
```

## 🔓 On VPS (No Login Needed!)

Since packages are public, Watchtower can pull without authentication:

```bash
# Clone repo
git clone https://github.com/deepan-alve/Win-my-Argument.git
cd Win-my-Argument

# Add Gemini API key
nano config.toml

# Deploy
docker-compose pull
docker-compose up -d
```

## 🤖 Watchtower Configuration

```yaml
watchtower:
  image: containrrr/watchtower
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  command: --interval 300 --cleanup
  restart: unless-stopped
```

Watchtower will check every 5 minutes for new images and auto-update!

## ✅ Verify Images are Public

Anyone can pull (no login):
```bash
docker pull ghcr.io/deepan-alve/win-my-argument-backend:latest
docker pull ghcr.io/deepan-alve/win-my-argument-frontend:latest
```

## 🔐 Security

**Public:** Docker images (compiled code)  
**Private:** API keys (config.toml), database, uploads

Your Gemini API key is never in the Docker image - it's mounted as a volume!

## 📝 Image URLs

- Backend: `ghcr.io/deepan-alve/win-my-argument-backend:latest`
- Frontend: `ghcr.io/deepan-alve/win-my-argument-frontend:latest`

View at: https://github.com/deepan-alve?tab=packages
