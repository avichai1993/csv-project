# Target Management System - Requirements Document

## Overview

A web-based system for managing Target objects with full CRUD (Create, Read, Update, Delete) operations. The system consists of:
1. **Backend**: RESTful API server with CSV file storage (3-layer architecture)
2. **Frontend**: Bootstrap-styled web UI with routing navigation
3. **Shared**: OpenAPI schema for API contract and auto-generated code

---

## System Architecture

### High-Level Architecture

```
┌─────────────────┐       HTTP/REST       ┌─────────────────────────────────────┐
│                 │ ◄──────────────────►  │           Backend Server            │
│   Web UI        │                       │  ┌─────────────────────────────────┐│
│   (React +      │                       │  │    API Layer (Controllers)      ││
│   React Router) │                       │  │    - DTOs ↔ Plain Objects       ││
│                 │                       │  └──────────────┬──────────────────┘│
└─────────────────┘                       │                 │                   │
        │                                 │  ┌──────────────▼──────────────────┐│
        │                                 │  │    BL Layer (Business Logic)    ││
        │                                 │  │    - Plain Objects only         ││
        │                                 │  └──────────────┬──────────────────┘│
        │                                 │                 │                   │
        │                                 │  ┌──────────────▼──────────────────┐│
        │                                 │  │    DAL Layer (Data Access)      ││
        │                                 │  │    - Plain Objects ↔ Entities   ││
        │                                 │  └──────────────┬──────────────────┘│
        │                                 └─────────────────┼───────────────────┘
        │                                                   │
        │                                                   │ Read/Write
        │                                                   ▼
        │                                          ┌─────────────────┐
        │                                          │   targets.csv   │
        │                                          │   (Local File)  │
        │                                          └─────────────────┘
        │
        └──────────────────► Nginx (serves static files + reverse proxy)
```

### Backend 3-Layer Architecture

| Layer | Responsibility | Object Types |
|-------|---------------|--------------|
| **API Layer** | HTTP request/response handling, validation, routing | DTOs ↔ Plain Objects |
| **BL Layer** | Business logic, orchestration | Plain Objects only |
| **DAL Layer** | Data persistence, CSV operations | Plain Objects ↔ Entities |

### Object Type Conventions

| Suffix | Purpose | Example |
|--------|---------|---------|
| `DTO` | Data Transfer Objects for API communication | `TargetDTO`, `TargetCreateDTO` |
| `Entity` | Objects for database/CSV interaction | `TargetEntity` |
| (none) | Plain objects for business logic | `Target` |

---

## Target Object Schema

| Attribute   | Type    | Constraints                                      | Example        |
|-------------|---------|--------------------------------------------------|----------------|
| id          | string  | UUID, auto-generated                             | "abc123..."    |
| latitude    | float   | -90 to 90                                        | 32.0853        |
| longitude   | float   | -180 to 180                                      | 34.7818        |
| altitude    | float   | Any number (meters)                              | 150.5          |
| frequency   | float   | Any positive number (common: 433, 915, 2.4, 5.2, 5.8) | 2.4        |
| speed       | float   | Positive number (m/s)                            | 25.0           |
| bearing     | float   | 0 to 360 (degrees)                               | 180.0          |
| ip_address  | string  | Valid IP format                                  | "192.168.1.1"  |

**Note:** Frequency accepts any positive number. The UI provides common frequencies (433, 915, 2.4, 5.2, 5.8) as suggestions in a dropdown with an option to enter custom values.

---

## RESTful API Specification

### Base URL
```
http://3.70.226.142:5000/api/v1
```

### API Versioning
All endpoints are versioned under `/api/v1/`. This allows future breaking changes to be introduced under `/api/v2/` without affecting existing clients.

### Endpoints

#### 0. Health Check
```
GET /api/health
```
**Response:** `200 OK`
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```
Used for Docker/Kubernetes readiness probes.

#### 1. Get All Targets
```
GET /api/v1/targets
```
**Response:** `200 OK` - Array of TargetDTO
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "latitude": 32.0853,
    "longitude": 34.7818,
    "altitude": 150.5,
    "frequency": 2.4,
    "speed": 25.0,
    "bearing": 180.0,
    "ip_address": "192.168.1.1"
  }
]
```

#### 2. Get Single Target
```
GET /api/v1/targets/<id>
```
**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "latitude": 32.0853,
  "longitude": 34.7818,
  "altitude": 150.5,
  "frequency": 2.4,
  "speed": 25.0,
  "bearing": 180.0,
  "ip_address": "192.168.1.1"
}
```

#### 3. Create Target
```
POST /api/v1/targets
Content-Type: application/json
```
**Request Body:**
```json
{
  "latitude": 32.0853,
  "longitude": 34.7818,
  "altitude": 150.5,
  "frequency": 2.4,
  "speed": 25.0,
  "bearing": 180.0,
  "ip_address": "192.168.1.1"
}
```
**Response:** `201 Created` - Returns the created TargetDTO
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "latitude": 32.0853,
  "longitude": 34.7818,
  "altitude": 150.5,
  "frequency": 2.4,
  "speed": 25.0,
  "bearing": 180.0,
  "ip_address": "192.168.1.1"
}
```

#### 4. Update Target
```
PUT /api/v1/targets/<id>
Content-Type: application/json
```
**Request Body:** (partial update supported)
```json
{
  "speed": 30.0,
  "bearing": 270.0
}
```
**Response:** `200 OK` - Returns the updated TargetDTO
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "latitude": 32.0853,
  "longitude": 34.7818,
  "altitude": 150.5,
  "frequency": 2.4,
  "speed": 30.0,
  "bearing": 270.0,
  "ip_address": "192.168.1.1"
}
```

#### 5. Delete Target
```
DELETE /api/v1/targets/<id>
```
**Response:** `200 OK` - Returns the deleted TargetDTO
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "latitude": 32.0853,
  "longitude": 34.7818,
  "altitude": 150.5,
  "frequency": 2.4,
  "speed": 25.0,
  "bearing": 180.0,
  "ip_address": "192.168.1.1"
}
```

### Request Tracing

All API responses include a `X-Request-ID` header for tracing and debugging:
```
X-Request-ID: 7f3d8a2b-1c4e-4f5a-9b6c-8d7e0f1a2b3c
```
- Auto-generated UUID for each request
- Included in all log entries for correlation
- Can be passed by client for end-to-end tracing

---

## CSV File Format

**File:** `targets.csv`

```csv
id,latitude,longitude,altitude,frequency,speed,bearing,ip_address
550e8400-e29b-41d4-a716-446655440000,32.0853,34.7818,150.5,2.4,25.0,180.0,192.168.1.1
```

---

## UI Requirements

### Features
1. **Target List View**
   - Display all targets in a **table** format
   - Show key attributes (ID, coordinates, frequency, speed, bearing, IP)
   - Last column contains **action icons** (Edit, Delete)
   - Click row to view details

2. **Add/Edit Target (Popup Modal)**
   - **Modal popup form** for both add and edit operations
   - All form fields with validation
   - Save/Cancel buttons
   - Form closes on successful save

3. **Delete Target**
   - Confirmation dialog before deletion
   - Shows target details in confirmation

4. **Routing Navigation**
   - `/` - Redirect to targets list
   - `/targets` - Target list view
   - `/targets/:id` - Target detail view (optional, can use modal)

5. **Frequency Input**
   - Dropdown with common frequencies (433, 915, 2.4, 5.2, 5.8)
   - Option to enter **custom positive number**
   - Display unit (MHz/GHz) based on value

6. **Mock Data (Development)**
   - Use **Faker.js** for random generated mock data
   - Realistic values within validation constraints

7. **Error Handling**
   - React Error Boundary for graceful error handling
   - User-friendly error messages
   - Retry options for failed requests

8. **Loading States**
   - Loading skeletons for table while fetching data
   - Spinner for form submissions
   - Better UX than blank screens

### UI Mockup

#### Main Table View
```
┌──────────────────────────────────────────────────────────────────────┐
│  Target Management System                          [+ Add Target]    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ ID        │ Lat/Lon      │ Freq  │ Speed │ Bearing │ IP       │🔧│
│  ├───────────┼──────────────┼───────┼───────┼─────────┼──────────┼──┤
│  │ abc123... │ 32.08/34.78  │ 2.4   │ 25.0  │ 180°    │ 192.168..│✏🗑│
│  │ def456... │ 31.76/35.21  │ 5.8   │ 40.0  │ 90°     │ 10.0.0.. │✏🗑│
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```
*Icons: ✏ = Edit, 🗑 = Delete*

#### Add/Edit Target Modal (Popup)
```
┌─────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║  Add New Target                              [X]      ║  │
│  ╠═══════════════════════════════════════════════════════╣  │
│  ║                                                       ║  │
│  ║  Latitude:  [32.0853    ]  Longitude: [34.7818    ]  ║  │
│  ║  Altitude:  [150.5      ]                            ║  │
│  ║  Frequency: [2.4 ▼ or custom]  Speed:  [25.0     ]   ║  │
│  ║  Bearing:   [180.0      ]  IP Address:[192.168.1.1]  ║  │
│  ║                                                       ║  │
│  ║                        [Cancel] [Save]                ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│  (background dimmed)                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Backend   | Python 3.11+ + Flask + Connexion (OpenAPI-first) |
| Frontend  | React 18+ + TypeScript + Bootstrap 5 + React Router |
| Storage   | CSV file (local) |
| Server    | Ubuntu (3.70.226.142) |
| Web Server | Nginx (static files + reverse proxy) |
| API Schema | OpenAPI 3.0.3 (YAML) - split into models and paths |
| Containerization | Docker + Docker Compose |
| Dependency Management | Poetry (backend), npm (frontend) |
| Logging | Python logging (backend) |
| Testing (Backend) | pytest + pytest-cov + Faker |
| Testing (Frontend) | Vitest + React Testing Library + @faker-js/faker |
| Mock Data | @faker-js/faker (frontend dev) |
| E2E Testing | Cypress |
| Code Generation | openapi-generator (backend + frontend) |

---

## OpenAPI Schema

### Schema Organization

The OpenAPI specification is split into multiple files for maintainability:

```
shared/
├── openapi/
│   ├── openapi.yaml          # Main file - references models and paths
│   ├── models.yaml           # All DTO definitions (auto-generates DTOs)
│   └── paths.yaml            # All API endpoint definitions (auto-generates routes/client)
```

### Schema Features
- **Single source of truth** for API contract
- **Auto-generates** to `backend/src/generated/` folder:
  - `dtos/` - Pydantic DTO classes from `models.yaml`
  - `routes/` - Flask route registrations from `paths.yaml`
- **Auto-generates** to `frontend/src/generated/` folder:
  - `api/` - Axios API client from `paths.yaml`
  - `models/` - TypeScript DTO types from `models.yaml`
- Powers Swagger UI at `/api/docs`
- No hardcoded API paths in backend or frontend code
- Clean regeneration: just delete `generated/` folder and regenerate

### DTO Naming Convention
All shared objects in the YAML use `DTO` suffix:
- `TargetDTO` - Full target object (used in responses)
- `TargetCreateDTO` - Request body for creating target
- `TargetUpdateDTO` - Request body for updating target
- `ErrorResponseDTO` - Standard error response

**Note:** GET /api/targets returns `TargetDTO[]` (array), not a wrapper object.

### Code Generation Commands

#### Frontend (single command for clean + generate + build)
```bash
cd frontend
npm run build:full    # Cleans generated/, regenerates from OpenAPI, builds project
```

Individual commands:
```bash
npm run clean:generated   # Remove all generated code
npm run generate:api      # Generate API client and types from OpenAPI
npm run build             # Build the project
```

#### Backend (single command for clean + generate + build)
```bash
cd backend
poetry run build-full    # Cleans generated/, regenerates from OpenAPI, builds project
```

Individual commands:
```bash
poetry run clean-generated   # Remove all generated code
poetry run generate-api      # Generate DTOs and routes from OpenAPI
poetry run build             # Build/validate the project
```

#### Root level (both frontend and backend)
```bash
npm run generate:all      # Generate all code for both frontend and backend
npm run build:all         # Clean, generate, and build everything
```

---

## Validation Rules

| Field      | Validation                                    |
|------------|-----------------------------------------------|
| latitude   | Required, number between -90 and 90           |
| longitude  | Required, number between -180 and 180         |
| altitude   | Required, number                              |
| frequency  | Required, any positive number                 |
| speed      | Required, positive number                     |
| bearing    | Required, number between 0 and 360            |
| ip_address | Required, valid IPv4 format                   |

---

## Error Responses

```json
{
  "error": "Target not found",
  "status": 404
}
```

```json
{
  "error": "Validation failed",
  "details": {
    "bearing": "Must be between 0 and 360"
  },
  "status": 400
}
```

---

## Testing

### Backend Tests

Located in `backend/tests/`:
- **test_unit.py** - Unit tests for validation functions, converters, and models
- **test_integration.py** - Integration tests for all API endpoints
- **test_bl.py** - Business logic layer tests
- **test_dal.py** - Data access layer tests

All tests use **Faker** for random generated test data.

```bash
cd backend
poetry install
poetry run pytest                          # Run all tests
poetry run pytest --cov=. --cov-report=html  # Run with coverage report
```

### Frontend Unit Tests

Located alongside components (`*.test.tsx`):
- **TargetList.test.tsx** - Tests for target list display and interactions
- **TargetForm.test.tsx** - Tests for form validation and submission
- **DeleteConfirmModal.test.tsx** - Tests for delete confirmation dialog

All tests use **@faker-js/faker** for random generated test data.

```bash
cd frontend
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run with coverage report
```

### End-to-End Tests (Cypress)

Located in `frontend/cypress/`:
- **e2e/targets.cy.ts** - Full CRUD workflow tests
- **e2e/navigation.cy.ts** - Routing and navigation tests
- **e2e/validation.cy.ts** - Form validation tests

```bash
cd frontend
npm run cypress:open   # Open Cypress UI
npm run cypress:run    # Run headless
npm run e2e            # Run with dev server
```

---

## Environment Configuration

### Environment Variables

The application uses environment variables for configuration. A `.env.example` file is provided as a template.

#### Backend Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Environment mode | `development` |
| `LOG_LEVEL` | Logging level (DEBUG, INFO, WARNING, ERROR) | `INFO` |
| `CSV_PATH` | Path to CSV storage file | `./data/targets.csv` |
| `CORS_ORIGINS` | Allowed CORS origins | `*` |

#### Frontend Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |
| `VITE_ENV` | Environment mode | `development` |

### Setup
```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

---

## Deployment

### Server Details
- **IP:** 3.70.226.142
- **Username:** ubuntu
- **Key File:** key1.pem
- **Ports:** 
  - 5000 (API - development)
  - 80 (Web UI + API via Nginx)

### Unified Run Scripts

Located in project root:

```bash
# Development environment (with mocks, hot reload)
./run.sh dev
# or
./run.ps1 dev   # Windows

# Production environment (optimized build)
./run.sh prod
# or
./run.ps1 prod  # Windows
```

### Environment URLs

| Environment | Web UI | API | Swagger Docs |
|-------------|--------|-----|--------------|
| Development | http://localhost:5000/ | http://localhost:5000/api/v1 | http://localhost:5000/api/docs |
| Production | http://3.70.226.142/ | http://3.70.226.142/api/v1 | http://3.70.226.142/api/docs |

### Docker Deployment (Recommended)

The system can be deployed using Docker Compose for easy setup and management.

#### Prerequisites
- SSH access to the server with sudo privileges
- Docker and Docker Compose (will be **auto-installed** by the script if not present)

#### Deploy with Docker
```bash
# Copy project files to server
scp -i key1.pem -r . ubuntu@3.70.226.142:/home/ubuntu/target-management

# SSH into server
ssh -i key1.pem ubuntu@3.70.226.142

# Navigate to project directory
cd /home/ubuntu/target-management

# Run deployment script (installs Docker if needed)
chmod +x run.sh
./run.sh prod
```

#### Docker Commands
```bash
docker compose up -d      # Start services
docker compose down       # Stop services
docker compose logs -f    # View logs
docker compose ps         # Check status
docker compose restart    # Restart services
```

### Nginx Configuration

Nginx serves as:
1. **Static file server** for the React frontend
2. **Reverse proxy** for the Flask API (`/api/*` routes)
3. **Single entry point** on port 80 (production) or 5000 (development)

---

## Project Structure

```
csv-project/
├── run.sh                    # Unified run script (Linux/Mac)
├── run.ps1                   # Unified run script (Windows)
├── docker-compose.yml        # Docker Compose configuration
├── docker-compose.dev.yml    # Development overrides
├── .dockerignore             # Docker ignore file
├── .env.example              # Environment variables template
├── .pre-commit-config.yaml   # Pre-commit hooks configuration
├── .github/                  # GitHub configuration
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI/CD pipeline
├── README.md                 # This document
│
├── shared/                   # Shared OpenAPI specifications
│   └── openapi/
│       ├── openapi.yaml      # Main OpenAPI file (references others)
│       ├── models.yaml       # DTO definitions (auto-generates code)
│       └── paths.yaml        # API endpoint definitions
│
├── backend/
│   ├── pyproject.toml        # Poetry dependencies
│   ├── poetry.lock           # Locked dependencies
│   ├── Dockerfile            # Backend Docker image
│   │
│   ├── src/
│   │   ├── __init__.py
│   │   ├── main.py           # Application entry point
│   │   │
│   │   ├── api/              # API Layer (Controllers) - manual code only
│   │   │   ├── __init__.py
│   │   │   ├── handlers.py   # Route handler implementations
│   │   │   └── converters/
│   │   │       └── dto_converter.py  # DTO ↔ Plain Object converters
│   │   │
│   │   ├── bl/               # Business Logic Layer
│   │   │   ├── __init__.py
│   │   │   └── target_service.py  # Business logic (plain objects only)
│   │   │
│   │   ├── dal/              # Data Access Layer
│   │   │   ├── __init__.py
│   │   │   ├── target_repository.py  # CSV operations
│   │   │   ├── entities/
│   │   │   │   └── target_entity.py  # Entity for CSV interaction
│   │   │   └── converters/
│   │   │       └── entity_converter.py  # Plain Object ↔ Entity converters
│   │   │
│   │   ├── models/           # Plain objects (no suffix)
│   │   │   ├── __init__.py
│   │   │   └── target.py     # Plain Target object for BL
│   │   │
│   │   └── generated/        # ALL auto-generated code (clean this folder to regenerate)
│   │       ├── __init__.py
│   │       ├── dtos/         # DTO classes from OpenAPI models
│   │       │   ├── __init__.py
│   │       │   ├── target_dto.py
│   │       │   ├── target_create_dto.py
│   │       │   └── target_update_dto.py
│   │       └── routes/       # Route definitions from OpenAPI paths
│   │           ├── __init__.py
│   │           └── target_routes.py  # Generated route registrations
│   │
│   └── tests/
│       ├── conftest.py       # Pytest fixtures
│       ├── factories/        # Test data factories
│       │   └── target_factory.py  # Random Target generators (Faker)
│       ├── test_unit.py      # Unit tests
│       ├── test_integration.py # Integration tests
│       ├── test_bl.py        # Business logic tests
│       └── test_dal.py       # Data access tests
│
├── frontend/
│   ├── package.json
│   ├── vite.config.ts        # Vite + Vitest config
│   ├── Dockerfile            # Frontend Docker image
│   │
│   ├── src/
│   │   ├── App.tsx           # Main React component
│   │   ├── main.tsx          # Entry point
│   │   │
│   │   ├── routes/           # React Router pages
│   │   │   ├── index.tsx     # Route definitions
│   │   │   ├── TargetListPage.tsx
│   │   │   ├── TargetDetailPage.tsx
│   │   │   ├── TargetCreatePage.tsx
│   │   │   └── TargetEditPage.tsx
│   │   │
│   │   ├── components/       # Reusable components
│   │   │   ├── TargetList.tsx
│   │   │   ├── TargetForm.tsx
│   │   │   ├── DeleteConfirmModal.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── ErrorBoundary.tsx    # Graceful error handling
│   │   │   └── LoadingSkeleton.tsx  # Loading state placeholders
│   │   │
│   │   ├── generated/        # Auto-generated from OpenAPI (clean this folder to regenerate)
│   │   │   ├── api/          # API client (no manual paths)
│   │   │   │   └── TargetApi.ts
│   │   │   └── models/       # DTO types
│   │   │       ├── TargetDTO.ts
│   │   │       ├── TargetCreateDTO.ts
│   │   │       ├── TargetUpdateDTO.ts
│   │   │       └── index.ts
│   │   │
│   │   └── test/
│   │       ├── setup.ts
│   │       ├── factories/    # Test data factories
│   │       │   └── targetFactory.ts  # Random Target generators (Faker)
│   │       └── mocks/
│   │
│   ├── cypress/              # E2E tests
│   │   ├── e2e/
│   │   │   ├── targets.cy.ts
│   │   │   ├── navigation.cy.ts
│   │   │   └── validation.cy.ts
│   │   ├── fixtures/
│   │   └── support/
│   │
│   └── nginx/
│       └── nginx.conf        # Nginx configuration
│
└── nginx/                    # Root Nginx config (Docker)
    └── nginx.conf
```

---

## Code Quality

### Pre-commit Hooks

Pre-commit hooks run automatically before each commit to ensure code quality:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: backend-lint
        name: Backend Lint (Ruff)
        entry: poetry run ruff check
        language: system
        files: ^backend/
      - id: backend-format
        name: Backend Format (Black)
        entry: poetry run black --check
        language: system
        files: ^backend/
      - id: frontend-lint
        name: Frontend Lint (ESLint)
        entry: npm run lint
        language: system
        files: ^frontend/
      - id: frontend-typecheck
        name: Frontend Type Check
        entry: npm run typecheck
        language: system
        files: ^frontend/
```

Setup:
```bash
pip install pre-commit
pre-commit install
```

### CI/CD Pipeline (GitHub Actions)

Automated testing and deployment on push:

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install Poetry
        run: pip install poetry
      - name: Install dependencies
        run: cd backend && poetry install
      - name: Run tests
        run: cd backend && poetry run pytest --cov

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run unit tests
        run: cd frontend && npm run test:run
      - name: Run E2E tests
        run: cd frontend && npm run cypress:run

  build:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker images
        run: docker compose build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        run: ./run.sh prod
```

---

## Best Practices

### Backend Best Practices

1. **Layered Architecture**
   - Clear separation of concerns (API, BL, DAL layers)
   - Each layer has single responsibility
   - Dependencies flow downward only (API → BL → DAL)

2. **Object Conversion**
   - Never pass DTOs to business logic layer
   - Never pass Entities outside data access layer
   - Use explicit converter functions between layers

3. **Dependency Management**
   - Use Poetry for Python dependency management
   - Lock file ensures reproducible builds
   - Separate dev and production dependencies

4. **OpenAPI-First Development**
   - Define API contract in YAML first
   - Generate code from specification
   - Single source of truth for API documentation

5. **Type Safety**
   - Use Pydantic for runtime validation
   - Avoid string-based dictionary access
   - Convert JSON to typed objects immediately

6. **Error Handling**
   - Consistent error response format
   - Appropriate HTTP status codes
   - Meaningful error messages

7. **Logging**
   - Use Python's `logging` module
   - Log at appropriate levels (DEBUG, INFO, WARNING, ERROR)
   - Include context (request ID, user, operation)
   - Log entry/exit of important operations
   - Log errors with stack traces
   - Configure different log levels for dev/prod

### Frontend Best Practices

1. **Component Architecture**
   - Separate pages (routes) from reusable components
   - Keep components focused and testable
   - Use TypeScript for type safety

2. **State Management**
   - Use React hooks for local state
   - Consider context for shared state
   - Keep API calls in dedicated service layer

3. **Routing**
   - Use React Router for navigation
   - Implement proper URL structure
   - Support browser back/forward navigation

4. **Code Generation**
   - Generate API client from OpenAPI
   - Generate TypeScript types from OpenAPI
   - Never manually write API paths

5. **Testing Strategy**
   - Unit tests for components (Vitest)
   - E2E tests for user flows (Cypress)
   - Mock API calls in unit tests

### DevOps Best Practices

1. **Containerization**
   - Multi-stage Docker builds
   - Separate dev and prod configurations
   - Use Docker Compose for orchestration

2. **Single Entry Point**
   - Nginx serves both static files and API
   - Unified URL structure
   - Simplified CORS handling

3. **Environment Configuration**
   - Environment-specific configurations
   - No hardcoded URLs or secrets
   - Use environment variables

4. **Unified Scripts**
   - Single script to build and run
   - Support both dev and prod environments
   - Cross-platform support (bash + PowerShell)

### Security Best Practices

1. **Input Validation**
   - Validate all inputs on backend
   - Use schema validation (Pydantic/OpenAPI)
   - Sanitize data before storage

2. **CORS Configuration**
   - Restrict allowed origins in production
   - Configure appropriate headers
   - Use Nginx for CORS in production

3. **Error Messages**
   - Don't expose internal errors to clients
   - Log detailed errors server-side
   - Return user-friendly messages

---

## Data Flow

### Create Target Flow

```
┌─────────┐    TargetCreateDTO    ┌─────────┐    Target (plain)    ┌─────────┐    Target (plain)    ┌─────────┐
│ Frontend│ ──────────────────► │ API     │ ──────────────────► │ BL      │ ──────────────────► │ DAL     │
│         │                      │ Layer   │                      │ Layer   │                      │ Layer   │
└─────────┘                      └─────────┘                      └─────────┘                      └─────────┘
                                      │                                                                 │
                                      │ dto_to_plain()                                                  │ plain_to_entity()
                                      ▼                                                                 ▼
                                 Target (plain)                                                    TargetEntity
                                                                                                        │
                                                                                                        │ write to CSV
                                                                                                        ▼
                                                                                                   targets.csv
```

**Key:** BL layer only knows plain objects. DAL receives plain objects and converts to Entity internally.

### Read Target Flow

```
┌─────────┐    TargetDTO          ┌─────────┐    Target (plain)    ┌─────────┐    Target (plain)    ┌─────────┐
│ Frontend│ ◄────────────────── │ API     │ ◄────────────────── │ BL      │ ◄────────────────── │ DAL     │
│         │                      │ Layer   │                      │ Layer   │                      │ Layer   │
└─────────┘                      └─────────┘                      └─────────┘                      └─────────┘
                                      │                                                                 │
                                      │ plain_to_dto()                                                  │ entity_to_plain()
                                      ▲                                                                 ▲
                                 Target (plain)                                                    TargetEntity
                                                                                                        │
                                                                                                        │ read from CSV
                                                                                                        ▲
                                                                                                   targets.csv
```

**Key:** DAL reads Entity from CSV, converts to plain object, returns to BL. BL only sees plain objects.

---

## Converter Functions

### DTO Converter (API Layer)

```python
# api/converters/dto_converter.py

def dto_to_plain(dto: TargetCreateDTO) -> Target:
    """Convert DTO to plain object for business logic"""
    return Target(
        latitude=dto.latitude,
        longitude=dto.longitude,
        # ... other fields
    )

def plain_to_dto(target: Target) -> TargetDTO:
    """Convert plain object to DTO for API response"""
    return TargetDTO(
        id=target.id,
        latitude=target.latitude,
        # ... other fields
    )
```

### Entity Converter (DAL Layer)

```python
# dal/converters/entity_converter.py

def plain_to_entity(target: Target) -> TargetEntity:
    """Convert plain object to entity for CSV storage"""
    return TargetEntity(
        id=target.id,
        latitude=target.latitude,
        # ... other fields
    )

def entity_to_plain(entity: TargetEntity) -> Target:
    """Convert entity from CSV to plain object"""
    return Target(
        id=entity.id,
        latitude=float(entity.latitude),  # CSV stores as string
        # ... other fields
    )
```
