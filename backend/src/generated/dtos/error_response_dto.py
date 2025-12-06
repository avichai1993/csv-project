"""Auto-generated ErrorResponseDTO from OpenAPI models.yaml

WARNING: This file is auto-generated. Do not edit manually.
"""

from typing import Optional
from pydantic import BaseModel, Field


class ErrorResponseDTO(BaseModel):
    """Standard error response format."""

    error: str = Field(..., description="Error message")
    details: Optional[dict[str, str]] = Field(
        None, description="Field-specific error details"
    )
    status: int = Field(..., description="HTTP status code")

    model_config = {
        "json_schema_extra": {
            "example": {
                "error": "Validation error",
                "details": {"latitude": "Must be between -90 and 90"},
                "status": 400,
            }
        }
    }
