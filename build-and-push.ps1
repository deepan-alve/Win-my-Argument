#!/usr/bin/env pwsh
# Docker Build and Push Script
# Usage: .\build-and-push.ps1 <your-vps-ip-or-domain>

param(
    [Parameter(Mandatory=$true, HelpMessage="Enter your VPS IP or domain")]
    [string]$VpsUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$DockerUsername = "deepanalve"
)

$ErrorActionPreference = "Stop"

Write-Host "`n🚀 Win-my-Argument Docker Build & Push" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Check if Docker is running
Write-Host "`n[1/5] Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Login to Docker Hub
Write-Host "`n[2/5] Logging into Docker Hub..." -ForegroundColor Yellow
docker login
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Docker login failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Logged in successfully" -ForegroundColor Green

# Build and push backend
Write-Host "`n[3/5] Building backend image..." -ForegroundColor Yellow
docker build -f backend.dockerfile -t ${DockerUsername}/win-my-argument-backend:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend built successfully" -ForegroundColor Green

Write-Host "Pushing backend image..." -ForegroundColor Yellow
docker push ${DockerUsername}/win-my-argument-backend:latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend push failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend pushed successfully" -ForegroundColor Green

# Build and push frontend
Write-Host "`n[4/5] Building frontend image..." -ForegroundColor Yellow
Write-Host "Using VPS URL: http://${VpsUrl}:3001" -ForegroundColor Cyan

docker build -f app.dockerfile `
  --build-arg NEXT_PUBLIC_API_URL="http://${VpsUrl}:3001/api" `
  --build-arg NEXT_PUBLIC_WS_URL="ws://${VpsUrl}:3001" `
  -t ${DockerUsername}/win-my-argument-frontend:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend built successfully" -ForegroundColor Green

Write-Host "Pushing frontend image..." -ForegroundColor Yellow
docker push ${DockerUsername}/win-my-argument-frontend:latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend push failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend pushed successfully" -ForegroundColor Green

# Success message
Write-Host "`n[5/5] Deployment Ready! ✓" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "`nNext Steps on VPS:" -ForegroundColor Yellow
Write-Host "  1. git pull (or clone repository)" -ForegroundColor White
Write-Host "  2. Add your Gemini API key to config.toml" -ForegroundColor White
Write-Host "  3. docker-compose pull" -ForegroundColor White
Write-Host "  4. docker-compose up -d" -ForegroundColor White
Write-Host "`n🌐 Access your app at: http://${VpsUrl}:3000" -ForegroundColor Cyan
Write-Host "📡 Watchtower will auto-update on new pushes`n" -ForegroundColor Gray
