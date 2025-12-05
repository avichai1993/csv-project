"""API Route Handlers - Implementation of API endpoints.

These handlers are called by the generated routes.
They use DTOs for input/output and plain objects for business logic.
"""

import logging
from datetime import datetime, timezone
from flask import request, g

from src.bl.target_service import TargetService
from src.api.converters.dto_converter import (
    dto_to_plain_create,
    dto_to_plain_update,
    plain_to_dto,
    plain_to_dto_list,
)
from src.generated.dtos import (
    TargetDTO,
    TargetCreateDTO,
    TargetUpdateDTO,
    ErrorResponseDTO,
    HealthResponseDTO,
)

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


# =============================================================================
# Health Check Handler
# =============================================================================


def get_health() -> tuple[dict, int]:
    """Handle GET /api/health - Health check endpoint."""
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Health check requested")
    
    response = HealthResponseDTO(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    return response.model_dump(), 200


# =============================================================================
# Target Handlers
# =============================================================================


def get_all_targets() -> tuple[list[dict], int]:
    """Handle GET /api/v1/targets - Get all targets."""
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Getting all targets")
    
    service = get_service()
    targets = service.get_all()
    
    dtos = plain_to_dto_list(targets)
    logger.info(f"[{request_id}] Returning {len(dtos)} targets")
    
    return [dto.model_dump() for dto in dtos], 200


def get_target_by_id(id: str) -> tuple[dict, int]:
    """Handle GET /api/v1/targets/{id} - Get target by ID."""
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Getting target: {id}")
    
    service = get_service()
    target = service.get_by_id(id)
    
    if target is None:
        logger.warning(f"[{request_id}] Target not found: {id}")
        error = ErrorResponseDTO(
            error="Target not found",
            status=404,
        )
        return error.model_dump(), 404
    
    dto = plain_to_dto(target)
    return dto.model_dump(), 200


def create_target() -> tuple[dict, int]:
    """Handle POST /api/v1/targets - Create a new target."""
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Creating new target")
    
    try:
        # Parse and validate request body
        data = request.get_json()
        if not data:
            error = ErrorResponseDTO(
                error="Request body is required",
                status=400,
            )
            return error.model_dump(), 400
        
        create_dto = TargetCreateDTO(**data)
        
        # Convert to plain object and call service
        plain_create = dto_to_plain_create(create_dto)
        service = get_service()
        created = service.create(plain_create)
        
        # Convert back to DTO for response
        dto = plain_to_dto(created)
        logger.info(f"[{request_id}] Target created: {dto.id}")
        
        return dto.model_dump(), 201
        
    except ValueError as e:
        logger.warning(f"[{request_id}] Validation error: {e}")
        error = ErrorResponseDTO(
            error="Validation error",
            details={"message": str(e)},
            status=400,
        )
        return error.model_dump(), 400
    except Exception as e:
        logger.error(f"[{request_id}] Error creating target: {e}")
        error = ErrorResponseDTO(
            error="Internal server error",
            status=500,
        )
        return error.model_dump(), 500


def update_target(id: str) -> tuple[dict, int]:
    """Handle PUT /api/v1/targets/{id} - Update a target."""
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Updating target: {id}")
    
    try:
        # Parse and validate request body
        data = request.get_json()
        if not data:
            error = ErrorResponseDTO(
                error="Request body is required",
                status=400,
            )
            return error.model_dump(), 400
        
        update_dto = TargetUpdateDTO(**data)
        
        # Convert to plain object and call service
        plain_update = dto_to_plain_update(update_dto)
        service = get_service()
        updated = service.update(id, plain_update)
        
        if updated is None:
            logger.warning(f"[{request_id}] Target not found: {id}")
            error = ErrorResponseDTO(
                error="Target not found",
                status=404,
            )
            return error.model_dump(), 404
        
        # Convert back to DTO for response
        dto = plain_to_dto(updated)
        logger.info(f"[{request_id}] Target updated: {id}")
        
        return dto.model_dump(), 200
        
    except ValueError as e:
        logger.warning(f"[{request_id}] Validation error: {e}")
        error = ErrorResponseDTO(
            error="Validation error",
            details={"message": str(e)},
            status=400,
        )
        return error.model_dump(), 400
    except Exception as e:
        logger.error(f"[{request_id}] Error updating target: {e}")
        error = ErrorResponseDTO(
            error="Internal server error",
            status=500,
        )
        return error.model_dump(), 500


def delete_target(id: str) -> tuple[dict, int]:
    """Handle DELETE /api/v1/targets/{id} - Delete a target."""
    request_id = getattr(g, "request_id", "unknown")
    logger.info(f"[{request_id}] Deleting target: {id}")
    
    service = get_service()
    deleted = service.delete(id)
    
    if deleted is None:
        logger.warning(f"[{request_id}] Target not found: {id}")
        error = ErrorResponseDTO(
            error="Target not found",
            status=404,
        )
        return error.model_dump(), 404
    
    # Convert to DTO for response
    dto = plain_to_dto(deleted)
    logger.info(f"[{request_id}] Target deleted: {id}")
    
    return dto.model_dump(), 200
