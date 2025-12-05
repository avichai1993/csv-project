#!/bin/bash
# Docker deployment script for Target Management System
# Run this on the Ubuntu server after copying files

set -e

echo "=== Target Management System - Docker Deployment ==="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker $USER
    echo "Docker installed. You may need to log out and back in for group changes to take effect."
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "Docker Compose not found. Please install docker-compose-plugin."
    exit 1
fi

echo "Building and starting containers..."

# Build and start services
docker compose build --no-cache
docker compose up -d

# Wait for services to be healthy
echo "Waiting for services to start..."
sleep 10

# Check service status
echo ""
echo "=== Service Status ==="
docker compose ps

# Show logs
echo ""
echo "=== Recent Logs ==="
docker compose logs --tail=20

echo ""
echo "=== Deployment Complete ==="
echo "Frontend: http://$(curl -s ifconfig.me 2>/dev/null || echo 'localhost')"
echo "API: http://$(curl -s ifconfig.me 2>/dev/null || echo 'localhost'):5000/api"
echo "API Docs: http://$(curl -s ifconfig.me 2>/dev/null || echo 'localhost'):5000/api/docs"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f        # Follow logs"
echo "  docker compose ps             # Check status"
echo "  docker compose down           # Stop services"
echo "  docker compose restart        # Restart services"
