#!/bin/bash
# Deployment script for Target Management System
# Run this on the Ubuntu server

set -e

echo "=== Target Management System Deployment ==="

# Update system
echo "Updating system packages..."
sudo apt-get update

# Install Python and pip
echo "Installing Python..."
sudo apt-get install -y python3 python3-pip python3-venv

# Install Node.js (for building frontend)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create application directory
APP_DIR=/opt/target-management
echo "Setting up application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown ubuntu:ubuntu $APP_DIR

# Copy backend files
echo "Setting up backend..."
cp -r backend/* $APP_DIR/

# Create Python virtual environment
cd $APP_DIR
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Build frontend
echo "Building frontend..."
cd /tmp
cp -r frontend /tmp/frontend-build
cd /tmp/frontend-build
npm install
VITE_API_URL=http://3.70.226.142:5000/api npm run build

# Copy built frontend to serve directory
sudo mkdir -p /var/www/target-management
sudo cp -r dist/* /var/www/target-management/
sudo chown -R www-data:www-data /var/www/target-management

# Install and configure nginx
echo "Installing nginx..."
sudo apt-get install -y nginx

# Create nginx config
sudo tee /etc/nginx/sites-available/target-management > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    root /var/www/target-management;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/target-management /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Create systemd service for Flask
echo "Creating systemd service..."
sudo tee /etc/systemd/system/target-api.service > /dev/null <<EOF
[Unit]
Description=Target Management API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=$APP_DIR
Environment="PATH=$APP_DIR/venv/bin"
ExecStart=$APP_DIR/venv/bin/python app.py
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start and enable service
sudo systemctl daemon-reload
sudo systemctl enable target-api
sudo systemctl start target-api

# Configure firewall
echo "Configuring firewall..."
sudo ufw allow 80/tcp
sudo ufw allow 5000/tcp
sudo ufw --force enable

echo ""
echo "=== Deployment Complete ==="
echo "Frontend: http://3.70.226.142"
echo "API: http://3.70.226.142:5000/api"
echo ""
echo "To check API status: sudo systemctl status target-api"
echo "To view API logs: sudo journalctl -u target-api -f"
