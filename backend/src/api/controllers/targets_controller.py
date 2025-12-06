"""Targets Controller - Target CRUD endpoint handlers.

Called by Connexion based on operationId values.
Uses the service layer for business logic.
"""

import logging
from flask import g

from src.bl.target_service import TargetService

logger = logging.getLogger(__name__)

# Service instance (can be injected for testing)
_service: TargetService | None = None


def get_service() -> TargetService:
    """Get or create the target service instance."""
    global _service
    if _service is None:
        _service = TargetService()
    return _service


def set_service(service: TargetService) -> None:
    """Set the target service instance (for testing)."""
    global _service
    _service = service


def _target_to_dict(target) -> dict:
    """Convert a Target object to a dictionary for JSON response."""
    return {
        "id": target.id,
        "latitude": target.latitude,
        "longitude": target.longitude,
        "altitude": target.altitude,
        "frequency": target.frequency,
        "speed": target.speed,
        "bearing": target.bearing,
        "ip_address": target.ip_address,
    }


def get_all_targets() -> tuple[list[dict], int]:
    """Handle GET /api/v1/targets - Get all targets.
    
    Returns:
        Tuple of (list of target dicts, status_code)
    """
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Getting all targets")
    
    service = get_service()
    targets = service.get_all()
    
    result = [_target_to_dict(t) for t in targets]
    logger.info(f"[{request_id}] Returning {len(result)} targets")
    
    return result, 200


def get_target_by_id(id: str) -> tuple[dict, int]:
    """Handle GET /api/v1/targets/{id} - Get target by ID.
    
    Args:
        id: Target UUID
        
    Returns:
        Tuple of (target dict or error dict, status_code)
    """
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Getting target: {id}")
    
    service = get_service()
    target = service.get_by_id(id)
    
    if target is None:
        logger.warning(f"[{request_id}] Target not found: {id}")
        return {"error": "Target not found"}, 404
    
    return _target_to_dict(target), 200


def create_target(body: dict) -> tuple[dict, int]:
    """Handle POST /api/v1/targets - Create a new target.
    
    Args:
        body: Request body with target data (parsed by Connexion)
        
    Returns:
        Tuple of (created target dict or error dict, status_code)
    """
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Creating new target")
    
    try:
        from src.models.target import TargetCreate
        
        # Create plain object from request body
        create_data = TargetCreate(
            latitude=body.get("latitude"),
            longitude=body.get("longitude"),
            altitude=body.get("altitude"),
            frequency=body.get("frequency"),
            speed=body.get("speed"),
            bearing=body.get("bearing"),
            ip_address=body.get("ip_address"),
        )
        
        service = get_service()
        created = service.create(create_data)
        
        logger.info(f"[{request_id}] Target created: {created.id}")
        return _target_to_dict(created), 201
        
    except ValueError as e:
        logger.warning(f"[{request_id}] Validation error: {e}")
        return {"error": "Validation error", "details": {"message": str(e)}}, 400
    except Exception as e:
        logger.error(f"[{request_id}] Error creating target: {e}")
        return {"error": "Internal server error"}, 500


def update_target(id: str, body: dict) -> tuple[dict, int]:
    """Handle PUT /api/v1/targets/{id} - Update a target.
    
    Args:
        id: Target UUID
        body: Request body with update data (parsed by Connexion)
        
    Returns:
        Tuple of (updated target dict or error dict, status_code)
    """
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Updating target: {id}")
    
    try:
        from src.models.target import TargetUpdate
        
        # Create update object from request body (all fields optional)
        update_data = TargetUpdate(
            latitude=body.get("latitude"),
            longitude=body.get("longitude"),
            altitude=body.get("altitude"),
            frequency=body.get("frequency"),
            speed=body.get("speed"),
            bearing=body.get("bearing"),
            ip_address=body.get("ip_address"),
        )
        
        service = get_service()
        updated = service.update(id, update_data)
        
        if updated is None:
            logger.warning(f"[{request_id}] Target not found: {id}")
            return {"error": "Target not found"}, 404
        
        logger.info(f"[{request_id}] Target updated: {id}")
        return _target_to_dict(updated), 200
        
    except ValueError as e:
        logger.warning(f"[{request_id}] Validation error: {e}")
        return {"error": "Validation error", "details": {"message": str(e)}}, 400
    except Exception as e:
        logger.error(f"[{request_id}] Error updating target: {e}")
        return {"error": "Internal server error"}, 500


def delete_target(id: str) -> tuple[dict, int]:
    """Handle DELETE /api/v1/targets/{id} - Delete a target.
    
    Args:
        id: Target UUID
        
    Returns:
        Tuple of (deleted target dict or error dict, status_code)
    """
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Deleting target: {id}")
    
    service = get_service()
    deleted = service.delete(id)
    
    if deleted is None:
        logger.warning(f"[{request_id}] Target not found: {id}")
        return {"error": "Target not found"}, 404
    
    logger.info(f"[{request_id}] Target deleted: {id}")
    return _target_to_dict(deleted), 200
