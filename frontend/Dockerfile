# Frontend Dockerfile - Multi-stage build
# Note: Build context is project root (for access to shared/)
FROM node:20-alpine AS builder

# Install Java for OpenAPI generator
RUN apk add --no-cache openjdk17-jre

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy shared OpenAPI specs first (needed for code generation)
COPY shared/ ../shared/

# Copy frontend source code
COPY frontend/ .

# Build argument for API URL (empty = relative paths, nginx proxies to backend)
ARG VITE_API_URL=
ARG VITE_USE_MOCKS=false
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_MOCKS=$VITE_USE_MOCKS

# Generate API client and build the application (skip tsc, vite handles TS)
RUN npm run generate:api && npx vite build

# Production stage with nginx
FROM nginx:alpine

# Install curl for health check
RUN apk add --no-cache curl

# Copy nginx config
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/nginx-health || exit 1

CMD ["nginx", "-g", "daemon off;"]
