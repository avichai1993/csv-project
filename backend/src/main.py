"""Target Management System - Application Entry Point.

This module creates and configures the Flask application with:
- CORS support
- Request ID middleware for tracing
- Logging configuration
- Route registration from generated routes
- Swagger UI at /api/docs
"""

import logging
import os
import uuid
from datetime import datetime, timezone

from flask import Flask, g, request, Response
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def configure_logging() -> None:
    """Configure application logging based on environment."""
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    
    logging.basicConfig(
        level=getattr(logging, log_level, logging.INFO),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    
    # Reduce noise from third-party libraries
    logging.getLogger("werkzeug").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)


def create_app() -> Flask:
    """Create and configure the Flask application.
    
    Returns:
        Configured Flask application instance
    """
    configure_logging()
    logger = logging.getLogger(__name__)
    
    app = Flask(__name__)
    
    # Configure CORS
    cors_origins = os.getenv("CORS_ORIGINS", "*")
    CORS(app, origins=cors_origins.split(",") if cors_origins != "*" else "*")
    
    # Request ID middleware
    @app.before_request
    def before_request():
        """Add request ID to each request for tracing."""
        # Use client-provided ID or generate new one
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        g.request_id = request_id
        g.request_start = datetime.now(timezone.utc)
        
        logger.debug(f"[{request_id}] {request.method} {request.path}")
    
    @app.after_request
    def after_request(response: Response) -> Response:
        """Add request ID header to response."""
        request_id = getattr(g, "request_id", "unknown")
        response.headers["X-Request-ID"] = request_id
        
        # Log request completion
        start = getattr(g, "request_start", None)
        if start:
            duration = (datetime.now(timezone.utc) - start).total_seconds() * 1000
            logger.info(
                f"[{request_id}] {request.method} {request.path} "
                f"-> {response.status_code} ({duration:.2f}ms)"
            )
        
        return response
    
    # Register routes from generated code
    from src.generated.routes import register_health_routes, register_target_routes
    
    register_health_routes(app)
    register_target_routes(app)
    
    # Swagger UI route
    @app.route("/api/docs")
    def swagger_ui():
        """Redirect to Swagger UI."""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Target Management API - Swagger UI</title>
            <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
        </head>
        <body>
            <div id="swagger-ui"></div>
            <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
            <script>
                SwaggerUIBundle({
                    url: '/api/openapi.yaml',
                    dom_id: '#swagger-ui',
                    presets: [SwaggerUIBundle.presets.apis],
                    layout: "BaseLayout"
                });
            </script>
        </body>
        </html>
        """
    
    # Serve OpenAPI spec
    @app.route("/api/openapi.yaml")
    def openapi_spec():
        """Serve the OpenAPI specification."""
        import yaml
        from pathlib import Path
        
        # Read and merge OpenAPI files
        spec_dir = Path(__file__).parent.parent.parent / "shared" / "openapi"
        
        with open(spec_dir / "openapi.yaml") as f:
            spec = yaml.safe_load(f)
        
        # For simplicity, return a bundled spec
        # In production, you might want to use a proper bundler
        return Response(
            yaml.dump(spec, default_flow_style=False),
            mimetype="text/yaml"
        )
    
    logger.info("Application initialized successfully")
    return app


def run() -> None:
    """Run the application."""
    app = create_app()
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_ENV", "development") == "development"
    
    app.run(host=host, port=port, debug=debug)


# Create app instance for WSGI servers
app = create_app()


if __name__ == "__main__":
    run()
