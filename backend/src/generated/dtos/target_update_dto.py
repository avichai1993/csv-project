"""Auto-generated TargetUpdateDTO from OpenAPI models.yaml

WARNING: This file is auto-generated. Do not edit manually.
"""

from typing import Optional
from pydantic import BaseModel, Field


class TargetUpdateDTO(BaseModel):
    """Request body for updating a target (all fields optional)."""

    latitude: Optional[float] = Field(None, ge=-90, le=90, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, ge=-180, le=180, description="Longitude coordinate")
    altitude: Optional[float] = Field(None, description="Altitude in meters")
    frequency: Optional[float] = Field(None, gt=0, description="Frequency (any positive number)")
    speed: Optional[float] = Field(None, ge=0, description="Speed in m/s")
    bearing: Optional[float] = Field(None, ge=0, le=360, description="Bearing in degrees")
    ip_address: Optional[str] = Field(
        None, pattern=r"^(\d{1,3}\.){3}\d{1,3}$", description="IPv4 address"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "speed": 30.0,
                "bearing": 270.0,
            }
        }
    }
