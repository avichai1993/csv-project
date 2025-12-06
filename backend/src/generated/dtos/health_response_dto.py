"""Auto-generated HealthResponseDTO from OpenAPI models.yaml

WARNING: This file is auto-generated. Do not edit manually.
"""

from pydantic import BaseModel, Field


class HealthResponseDTO(BaseModel):
    """Health check response."""

    status: str = Field(..., description="Health status")
    version: str = Field(..., description="API version")
    timestamp: str = Field(..., description="Current server time (ISO 8601)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "healthy",
                "version": "1.0.0",
                "timestamp": "2024-01-15T10:30:00Z",
            }
        }
    }
