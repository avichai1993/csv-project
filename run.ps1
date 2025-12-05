# Target Management System - Unified Run Script (Windows)
# Usage: .\run.ps1 [dev|prod]

param(
    [string]$Env = "dev"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Green
Write-Host "Target Management System" -ForegroundColor Green
Write-Host "Environment: $Env" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

# Check if Docker is installed
function Check-Docker {
    try {
        docker --version | Out-Null
        docker compose version | Out-Null
        Write-Host "Docker is installed" -ForegroundColor Green
    }
    catch {
        Write-Host "Docker is not installed or not running." -ForegroundColor Red
        Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        exit 1
    }
}

# Build and run development environment
function Run-Dev {
    Write-Host "Starting development environment..." -ForegroundColor Green
    
    # Copy environment file if not exists
    if (-not (Test-Path ".env")) {
        Copy-Item ".env.example" ".env"
        Write-Host "Created .env file from .env.example" -ForegroundColor Yellow
    }
    
    # Build and start with dev overrides
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
}

# Build and run production environment
function Run-Prod {
    Write-Host "Starting production environment..." -ForegroundColor Green
    
    # Copy environment file if not exists
    if (-not (Test-Path ".env")) {
        Copy-Item ".env.example" ".env"
        Write-Host "Created .env file from .env.example" -ForegroundColor Yellow
        Write-Host "Please update .env with production values!" -ForegroundColor Red
    }
    
    # Build and start in detached mode
    docker compose up --build -d
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Production environment started!" -ForegroundColor Green
    Write-Host "Web UI: http://localhost" -ForegroundColor Green
    Write-Host "API: http://localhost/api/v1" -ForegroundColor Green
    Write-Host "Swagger: http://localhost/api/docs" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "View logs: docker compose logs -f"
    Write-Host "Stop: docker compose down"
}

# Main
Check-Docker

switch ($Env.ToLower()) {
    { $_ -in "dev", "development" } {
        Run-Dev
    }
    { $_ -in "prod", "production" } {
        Run-Prod
    }
    default {
        Write-Host "Unknown environment: $Env" -ForegroundColor Red
        Write-Host "Usage: .\run.ps1 [dev|prod]"
        exit 1
    }
}
