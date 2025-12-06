"""Auto-generated target routes from OpenAPI paths.yaml

WARNING: This file is auto-generated. Do not edit manually.
"""

from flask import Blueprint

targets_bp = Blueprint("targets", __name__)


def register_target_routes(app):
    """Register target routes with the Flask app.
    
    Args:
        app: Flask application instance
    """
    from src.api.handlers import (
        get_all_targets,
        get_target_by_id,
        create_target,
        update_target,
        delete_target,
    )
    
    @app.route("/api/v1/targets", methods=["GET"])
    def list_targets():
        """GET /api/v1/targets - Get all targets."""
        return get_all_targets()
    
    @app.route("/api/v1/targets", methods=["POST"])
    def create_new_target():
        """POST /api/v1/targets - Create a new target."""
        return create_target()
    
    @app.route("/api/v1/targets/<id>", methods=["GET"])
    def get_target(id: str):
        """GET /api/v1/targets/{id} - Get target by ID."""
        return get_target_by_id(id)
    
    @app.route("/api/v1/targets/<id>", methods=["PUT"])
    def update_existing_target(id: str):
        """PUT /api/v1/targets/{id} - Update a target."""
        return update_target(id)
    
    @app.route("/api/v1/targets/<id>", methods=["DELETE"])
    def delete_existing_target(id: str):
        """DELETE /api/v1/targets/{id} - Delete a target."""
        return delete_target(id)
