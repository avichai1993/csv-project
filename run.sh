#!/bin/bash
# Target Management System - Unified Run Script
# Usage: ./run.sh [dev|prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default environment
ENV="${1:-dev}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Target Management System${NC}"
echo -e "${GREEN}Environment: ${YELLOW}${ENV}${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}Docker not found. Installing Docker...${NC}"
        curl -fsSL https://get.docker.com | sh
        sudo usermod -aG docker $USER
        echo -e "${GREEN}Docker installed. You may need to log out and back in for group changes.${NC}"
    fi

    if ! command -v docker compose &> /dev/null; then
        echo -e "${YELLOW}Docker Compose not found. Installing...${NC}"
        sudo apt-get update
        sudo apt-get install -y docker-compose-plugin
    fi

    echo -e "${GREEN}Docker version:${NC}"
    docker --version
    docker compose version
}

# Build and run development environment
run_dev() {
    echo -e "${GREEN}Starting development environment...${NC}"
    
    # Copy environment file if not exists
    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${YELLOW}Created .env file from .env.example${NC}"
    fi
    
    # Build and start with dev overrides
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
}

# Build and run production environment
run_prod() {
    echo -e "${GREEN}Starting production environment...${NC}"
    
    # Copy environment file if not exists
    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${YELLOW}Created .env file from .env.example${NC}"
        echo -e "${RED}Please update .env with production values!${NC}"
    fi
    
    # Build and start in detached mode
    docker compose up --build -d
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Production environment started!${NC}"
    echo -e "${GREEN}Web UI: http://localhost${NC}"
    echo -e "${GREEN}API: http://localhost/api/v1${NC}"
    echo -e "${GREEN}Swagger: http://localhost/api/docs${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "View logs: docker compose logs -f"
    echo "Stop: docker compose down"
}

# Main
check_docker

case "$ENV" in
    dev|development)
        run_dev
        ;;
    prod|production)
        run_prod
        ;;
    *)
        echo -e "${RED}Unknown environment: $ENV${NC}"
        echo "Usage: ./run.sh [dev|prod]"
        exit 1
        ;;
esac
