"""
Pydantic models (DTOs) generated from OpenAPI schema
"""
from typing import Optional
from pydantic import BaseModel, Field, field_validator
import re


# Valid frequency options from OpenAPI schema
VALID_FREQUENCIES = [433, 915, 2.4, 5.2, 5.8]


class TargetCreate(BaseModel):
    """DTO for creating a new target"""
    latitude: float = Field(..., ge=-90, le=90, description="Latitude coordinate")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude coordinate")
    altitude: float = Field(..., description="Altitude in meters")
    frequency: float = Field(..., description="Frequency value")
    speed: float = Field(..., ge=0, description="Speed in m/s")
    bearing: float = Field(..., ge=0, le=360, description="Bearing in degrees")
    ip_address: str = Field(..., description="IPv4 address")

    @field_validator('frequency')
    @classmethod
    def validate_frequency(cls, v: float) -> float:
        if v not in VALID_FREQUENCIES:
            raise ValueError(f'Frequency must be one of: {VALID_FREQUENCIES}')
        return v

    @field_validator('ip_address')
    @classmethod
    def validate_ip_address(cls, v: str) -> str:
        pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
        if not re.match(pattern, v):
            raise ValueError('Must be a valid IPv4 address')
        octets = v.split('.')
        for octet in octets:
            if int(octet) > 255:
                raise ValueError('Must be a valid IPv4 address')
        return v


class TargetUpdate(BaseModel):
    """DTO for updating an existing target (all fields optional)"""
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    altitude: Optional[float] = None
    frequency: Optional[float] = None
    speed: Optional[float] = Field(None, ge=0)
    bearing: Optional[float] = Field(None, ge=0, le=360)
    ip_address: Optional[str] = None

    @field_validator('frequency')
    @classmethod
    def validate_frequency(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v not in VALID_FREQUENCIES:
            raise ValueError(f'Frequency must be one of: {VALID_FREQUENCIES}')
        return v

    @field_validator('ip_address')
    @classmethod
    def validate_ip_address(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
        if not re.match(pattern, v):
            raise ValueError('Must be a valid IPv4 address')
        octets = v.split('.')
        for octet in octets:
            if int(octet) > 255:
                raise ValueError('Must be a valid IPv4 address')
        return v


class Target(BaseModel):
    """Full target model with ID"""
    id: str = Field(..., description="Unique identifier")
    latitude: float
    longitude: float
    altitude: float
    frequency: float
    speed: float
    bearing: float
    ip_address: str


class TargetListResponse(BaseModel):
    """Response for listing all targets"""
    targets: list[Target]
    count: int


class CreateResponse(BaseModel):
    """Response for target creation"""
    id: str
    message: str


class MessageResponse(BaseModel):
    """Generic message response"""
    message: str


class ErrorResponse(BaseModel):
    """Error response"""
    error: str
    status: int


class ValidationErrorResponse(BaseModel):
    """Validation error response"""
    error: str
    details: dict[str, str]
    status: int
