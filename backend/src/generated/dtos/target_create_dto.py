"""Auto-generated TargetCreateDTO from OpenAPI models.yaml

WARNING: This file is auto-generated. Do not edit manually.
"""

from pydantic import BaseModel, Field


class TargetCreateDTO(BaseModel):
    """Request body for creating a new target."""

    latitude: float = Field(..., ge=-90, le=90, description="Latitude coordinate")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude coordinate")
    altitude: float = Field(..., description="Altitude in meters")
    frequency: float = Field(..., gt=0, description="Frequency (any positive number)")
    speed: float = Field(..., ge=0, description="Speed in m/s")
    bearing: float = Field(..., ge=0, le=360, description="Bearing in degrees")
    ip_address: str = Field(..., pattern=r"^(\d{1,3}\.){3}\d{1,3}$", description="IPv4 address")

    model_config = {
        "json_schema_extra": {
            "example": {
                "latitude": 32.0853,
                "longitude": 34.7818,
                "altitude": 150.5,
                "frequency": 2.4,
                "speed": 25.0,
                "bearing": 180.0,
                "ip_address": "192.168.1.1",
            }
        }
    }
