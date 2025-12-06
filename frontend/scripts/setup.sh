#!/bin/bash
# Frontend Setup Script
# Ensures all prerequisites are installed and the project is ready to run
# Works on: Linux, macOS, Windows (Git Bash/WSL)

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"

echo "=========================================="
echo "Frontend Setup Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success() { echo -e "${GREEN}✓ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
error() { echo -e "${RED}✗ $1${NC}"; exit 1; }

# Check Node.js
echo ""
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    success "Node.js installed: $NODE_VERSION"
    
    # Check minimum version (20.x)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | tr -d 'v')
    if [ "$MAJOR_VERSION" -lt 20 ]; then
        warning "Node.js 20+ recommended. Current: $NODE_VERSION"
    fi
else
    error "Node.js not found. Please install Node.js 20+ from https://nodejs.org"
fi

# Check npm
echo ""
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    success "npm installed: $NPM_VERSION"
else
    error "npm not found. It should come with Node.js installation."
fi

# Check Java (required for OpenAPI generator)
echo ""
echo "Checking Java..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    success "Java installed: $JAVA_VERSION"
else
    warning "Java not found. Required for OpenAPI code generation."
    echo "  Install options:"
    echo "  - macOS: brew install openjdk@17"
    echo "  - Ubuntu: sudo apt install openjdk-17-jre"
    echo "  - Windows: Download from https://adoptium.net"
    
    # Don't exit - Java is only needed for code generation
    JAVA_MISSING=true
fi

# Install dependencies
echo ""
echo "Installing npm dependencies..."
cd "$FRONTEND_DIR"
npm install
success "Dependencies installed"

# Generate API code (if Java is available)
echo ""
echo "Generating API code from OpenAPI spec..."
if [ "$JAVA_MISSING" = true ]; then
    warning "Skipping code generation (Java not installed)"
    if [ ! -d "src/generated" ]; then
        error "Generated code missing and Java not available. Please install Java."
    else
        warning "Using existing generated code"
    fi
else
    npm run generate:api
    success "API code generated"
fi

echo ""
echo "=========================================="
success "Setup complete!"
echo "=========================================="
echo ""
echo "Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run test         - Run unit tests (watch mode)"
echo "  npm run test:run     - Run unit tests (single run)"
echo "  npm run lint         - Run ESLint"
echo "  npm run typecheck    - Run TypeScript type checking"
echo "  npm run build        - Build for production"
echo "  npm run ci           - Run full CI pipeline"
echo ""
