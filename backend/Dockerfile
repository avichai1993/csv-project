# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy dependency files
COPY pyproject.toml poetry.lock* ./

# Install dependencies (no dev dependencies in production)
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --only main --no-root

# Copy application code
COPY src/ ./src/
COPY data/ ./data/

# Note: shared OpenAPI specs are mounted via docker-compose volumes

# Create data directory for CSV
RUN mkdir -p /app/data

# Set environment variables
ENV PYTHONPATH=/app
ENV FLASK_ENV=production
ENV LOG_LEVEL=INFO
ENV CSV_PATH=/app/data/targets.csv

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Run the application
CMD ["python", "-m", "src.main"]
