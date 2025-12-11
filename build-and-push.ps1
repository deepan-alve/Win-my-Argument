# Docker Build and Push Script for Windows PowerShell
# Usage: .\build-and-push.ps1 <your-vps-ip-or-domain>

param(
    [Parameter(Mandatory=$true)]
    [string]$VpsUrl
)

Write-Host "Building and pushing Docker images for Win-my-Argument..." -ForegroundColor Green

# Check if Docker is running
try {
    docker ps | Out-Null
} catch {
    Write-Host "Error: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Login to Docker Hub
Write-Host "`nLogging into Docker Hub..." -ForegroundColor Yellow
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker login failed!" -ForegroundColor Red
    exit 1
}

# Build and push backend
Write-Host "`nBuilding backend image..." -ForegroundColor Yellow
docker build -f backend.dockerfile -t deepanalve/win-my-argument-backend:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Pushing backend image..." -ForegroundColor Yellow
docker push deepanalve/win-my-argument-backend:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend push failed!" -ForegroundColor Red
    exit 1
}

# Build and push frontend
Write-Host "`nBuilding frontend image with VPS URL: $VpsUrl" -ForegroundColor Yellow
docker build -f app.dockerfile `
  --build-arg NEXT_PUBLIC_API_URL="http://${VpsUrl}:3001/api" `
  --build-arg NEXT_PUBLIC_WS_URL="ws://${VpsUrl}:3001" `
  -t deepanalve/win-my-argument-frontend:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Pushing frontend image..." -ForegroundColor Yellow
docker push deepanalve/win-my-argument-frontend:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend push failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ All images built and pushed successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. SSH into your VPS"
Write-Host "2. Clone the repository or copy docker-compose.yaml"
Write-Host "3. Copy config.toml with your Gemini API key"
Write-Host "4. Run: docker-compose pull"
Write-Host "5. Run: docker-compose up -d"
Write-Host "`nWatchtower will automatically update when you push new images."
