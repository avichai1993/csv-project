# Target Management System - Quick Start Guide

## Prerequisites

- **Node.js 20+** (frontend)
- **Python 3.11+** (backend)
- **Docker** (for production deployment)

---

## Local Development

### Backend

```bash
cd backend

# Install dependencies
pip install poetry
poetry install

# Run tests
poetry run pytest

# Start server
python -m src.main
```

Backend runs at: http://localhost:5000

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Generate API client from OpenAPI
npm run generate:api

# Run tests
npm run test:run

# Run E2E tests
npm run e2e

# Start dev server (with mocks)
npm run dev
```

Frontend runs at: http://localhost:5173

### Frontend with Real Backend

Edit `.env.development`:
```env
VITE_USE_MOCKS=false
VITE_API_URL=http://localhost:5000
```

Then run `npm run dev`.

---

## Docker Deployment

### Option 1: Docker Desktop (if available)

```bash
cd csv-project
docker compose build
docker compose up -d
```

### Option 2: WSL with Docker Engine (Windows without Docker Desktop)

```powershell
# 1. Ensure Ubuntu is WSL2
wsl --set-version Ubuntu 2

# 2. Install Docker in WSL
wsl -d Ubuntu -e bash -c "sudo apt-get update && sudo apt-get install -y docker.io docker-compose-v2"

# 3. Start Docker and build
wsl -d Ubuntu -e bash -c "sudo service docker start && cd /mnt/c/code/Gitlab/csv-project && docker compose build"

# 4. Run (keep terminal open)
wsl -d Ubuntu
cd /mnt/c/code/Gitlab/csv-project
sudo service docker start
docker compose up
```

App runs at: http://localhost (or WSL IP)

### Docker Commands

```bash
# View logs
docker compose logs -f

# Stop
docker compose down

# Restart
docker compose restart

# Rebuild
docker compose up --build -d
```

---

## Test Summary

| Type | Command | Location |
|------|---------|----------|
| Backend Unit | `poetry run pytest tests/test_unit.py` | backend/ |
| Backend Integration | `poetry run pytest tests/test_integration.py` | backend/ |
| Frontend Unit | `npm run test:run` | frontend/ |
| Frontend E2E | `npm run e2e` | frontend/ |

### Current Test Results

- **Backend:** 37 tests passing
- **Frontend Unit:** 27 tests passing  
- **Frontend E2E:** 11 tests passing

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/v1/targets` | List all targets |
| GET | `/api/v1/targets/:id` | Get single target |
| POST | `/api/v1/targets` | Create target |
| PUT | `/api/v1/targets/:id` | Update target |
| DELETE | `/api/v1/targets/:id` | Delete target |

---

## Project Structure

```
csv-project/
├── shared/openapi/        # OpenAPI specs (single source of truth)
├── backend/               # Flask API (Python)
│   ├── src/
│   │   ├── api/          # API layer (handlers)
│   │   ├── bl/           # Business logic
│   │   ├── dal/          # Data access (CSV)
│   │   └── generated/    # Auto-generated DTOs
│   └── tests/
├── frontend/              # React UI (TypeScript)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── routes/       # Page components
│   │   ├── services/     # API client wrapper
│   │   ├── mocks/        # MSW handlers
│   │   └── generated/    # Auto-generated API client
│   └── cypress/          # E2E tests
├── nginx/                 # Nginx config
└── docker-compose.yml     # Docker orchestration
```

---

## Regenerating Code from OpenAPI

```bash
# Frontend
cd frontend
npm run generate:api

# Backend (if using code generation)
cd backend
# DTOs are manually created based on OpenAPI spec
```
