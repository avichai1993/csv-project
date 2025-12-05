"""Plain Target object for business logic layer.

This class has no suffix and is used exclusively in the BL layer.
It should not be used directly in API responses or data storage.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class Target:
    """Plain Target object for business logic operations."""

    id: str
    latitude: float
    longitude: float
    altitude: float
    frequency: float
    speed: float
    bearing: float
    ip_address: str

    def __post_init__(self):
        """Validate fields after initialization."""
        if not (-90 <= self.latitude <= 90):
            raise ValueError(f"Latitude must be between -90 and 90, got {self.latitude}")
        if not (-180 <= self.longitude <= 180):
            raise ValueError(f"Longitude must be between -180 and 180, got {self.longitude}")
        if self.frequency <= 0:
            raise ValueError(f"Frequency must be positive, got {self.frequency}")
        if self.speed < 0:
            raise ValueError(f"Speed must be non-negative, got {self.speed}")
        if not (0 <= self.bearing <= 360):
            raise ValueError(f"Bearing must be between 0 and 360, got {self.bearing}")


@dataclass
class TargetCreate:
    """Data for creating a new Target (no ID yet)."""

    latitude: float
    longitude: float
    altitude: float
    frequency: float
    speed: float
    bearing: float
    ip_address: str


@dataclass
class TargetUpdate:
    """Data for updating a Target (all fields optional)."""

    latitude: Optional[float] = None
    longitude: Optional[float] = None
    altitude: Optional[float] = None
    frequency: Optional[float] = None
    speed: Optional[float] = None
    bearing: Optional[float] = None
    ip_address: Optional[str] = None

    def has_updates(self) -> bool:
        """Check if any field is set for update."""
        return any(
            getattr(self, field) is not None
            for field in [
                "latitude",
                "longitude",
                "altitude",
                "frequency",
                "speed",
                "bearing",
                "ip_address",
            ]
        )
