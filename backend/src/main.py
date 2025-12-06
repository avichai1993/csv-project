"""Target Management System - Application Entry Point.

This module creates and configures the Flask application with:
- Connexion for OpenAPI-based routing
- CORS support
- Request ID middleware for tracing
- Logging configuration
- Swagger UI at /api/docs (provided by connexion)
"""

import logging
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path

import connexion
from flask import g, request, Response
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


def create_app():
    """Create and configure the Connexion/Flask application.
    
    Returns:
        Configured Connexion application instance
    """
    configure_logging()
    logger = logging.getLogger(__name__)
    
    # Determine OpenAPI spec location
    # In Docker/Render: generated spec is at src/generated/openapi/
    # Locally: use shared/openapi/bundled/openapi/ (bundled spec with resolved refs)
    generated_spec = Path(__file__).parent / "generated" / "openapi"
    bundled_spec = Path(__file__).parent.parent.parent / "shared" / "openapi" / "bundled" / "openapi"
    
    if generated_spec.exists():
        spec_dir = generated_spec
    else:
        spec_dir = bundled_spec
    
    logger.info(f"Using OpenAPI spec from: {spec_dir}")
    
    # Create Connexion app
    connexion_app = connexion.App(
        __name__,
        specification_dir=str(spec_dir),
    )
    
    # Add API with OpenAPI spec
    # x-openapi-router-controller tells connexion where to find the controller functions
    connexion_app.add_api(
        "openapi.yaml",
        arguments={"title": "Target Management API"},
        pythonic_params=True,
        strict_validation=True,
        validate_responses=False,  # Don't validate responses for flexibility
    )
    
    # Get the underlying Flask app
    flask_app = connexion_app.app
    
    # Add manual Swagger UI route since connexion 3.x swagger_ui_options has issues
    @flask_app.route("/api/docs")
    def swagger_ui():
        """Serve Swagger UI."""
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
                    url: '/openapi.json',
                    dom_id: '#swagger-ui',
                    presets: [SwaggerUIBundle.presets.apis],
                    layout: "BaseLayout"
                });
            </script>
        </body>
        </html>
        """
    
    # Configure CORS
    cors_origins = os.getenv("CORS_ORIGINS", "*")
    CORS(flask_app, origins=cors_origins.split(",") if cors_origins != "*" else "*")
    
    # Request ID middleware
    @flask_app.before_request
    def before_request():
        """Add request ID to each request for tracing."""
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        g.request_id = request_id
        g.request_start = datetime.now(timezone.utc)
        
        logger.debug(f"[{request_id}] {request.method} {request.path}")
    
    @flask_app.after_request
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
    
    logger.info("Application initialized successfully")
    return connexion_app


def run() -> None:
    """Run the application."""
    connexion_app = create_app()
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))
    
    connexion_app.run(host=host, port=port)


# Create app instance for WSGI servers
connexion_app = create_app()
app = connexion_app.app  # Flask app for WSGI


if __name__ == "__main__":
    run()
