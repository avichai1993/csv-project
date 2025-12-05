"""DTO Converter - Convert between DTOs and plain objects.

This converter is used in the API layer to transform:
- DTOs (from API requests) → Plain objects (for BL)
- Plain objects (from BL) → DTOs (for API responses)
"""

from src.models.target import Target, TargetCreate, TargetUpdate
from src.generated.dtos import TargetDTO, TargetCreateDTO, TargetUpdateDTO


def dto_to_plain_create(dto: TargetCreateDTO) -> TargetCreate:
    """Convert TargetCreateDTO to TargetCreate plain object.
    
    Args:
        dto: TargetCreateDTO from API request
        
    Returns:
        TargetCreate plain object for business logic
    """
    return TargetCreate(
        latitude=dto.latitude,
        longitude=dto.longitude,
        altitude=dto.altitude,
        frequency=dto.frequency,
        speed=dto.speed,
        bearing=dto.bearing,
        ip_address=dto.ip_address,
    )


def dto_to_plain_update(dto: TargetUpdateDTO) -> TargetUpdate:
    """Convert TargetUpdateDTO to TargetUpdate plain object.
    
    Args:
        dto: TargetUpdateDTO from API request
        
    Returns:
        TargetUpdate plain object for business logic
    """
    return TargetUpdate(
        latitude=dto.latitude,
        longitude=dto.longitude,
        altitude=dto.altitude,
        frequency=dto.frequency,
        speed=dto.speed,
        bearing=dto.bearing,
        ip_address=dto.ip_address,
    )


def plain_to_dto(target: Target) -> TargetDTO:
    """Convert plain Target object to TargetDTO.
    
    Args:
        target: Plain Target object from business logic
        
    Returns:
        TargetDTO for API response
    """
    return TargetDTO(
        id=target.id,
        latitude=target.latitude,
        longitude=target.longitude,
        altitude=target.altitude,
        frequency=target.frequency,
        speed=target.speed,
        bearing=target.bearing,
        ip_address=target.ip_address,
    )


def plain_to_dto_list(targets: list[Target]) -> list[TargetDTO]:
    """Convert list of plain Target objects to list of TargetDTOs.
    
    Args:
        targets: List of plain Target objects
        
    Returns:
        List of TargetDTOs for API response
    """
    return [plain_to_dto(t) for t in targets]


# Convenience aliases
dto_to_plain = dto_to_plain_create
