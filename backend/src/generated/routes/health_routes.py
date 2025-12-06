"""Auto-generated health routes from OpenAPI paths.yaml

WARNING: This file is auto-generated. Do not edit manually.
"""

from flask import Blueprint

health_bp = Blueprint("health", __name__)


def register_health_routes(app):
    """Register health check routes with the Flask app.
    
    Args:
        app: Flask application instance
    """
    from src.api.handlers import get_health
    
    @app.route("/api/health", methods=["GET"])
    def health_check():
        """GET /api/health - Health check endpoint."""
        return get_health()
