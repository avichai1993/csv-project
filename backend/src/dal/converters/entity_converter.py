"""Entity Converter - Convert between plain objects and entities.

This converter is used in the DAL layer to transform:
- Plain objects (from BL) → Entities (for CSV storage)
- Entities (from CSV) → Plain objects (for BL)
"""

from src.models.target import Target
from src.dal.entities.target_entity import TargetEntity


def plain_to_entity(target: Target) -> TargetEntity:
    """Convert a plain Target object to a TargetEntity for CSV storage.
    
    Args:
        target: Plain Target object from business logic layer
        
    Returns:
        TargetEntity ready for CSV storage (all fields as strings)
    """
    return TargetEntity(
        id=target.id,
        latitude=str(target.latitude),
        longitude=str(target.longitude),
        altitude=str(target.altitude),
        frequency=str(target.frequency),
        speed=str(target.speed),
        bearing=str(target.bearing),
        ip_address=target.ip_address,
    )


def entity_to_plain(entity: TargetEntity) -> Target:
    """Convert a TargetEntity from CSV to a plain Target object.
    
    Args:
        entity: TargetEntity read from CSV storage
        
    Returns:
        Plain Target object for business logic layer
    """
    return Target(
        id=entity.id,
        latitude=float(entity.latitude),
        longitude=float(entity.longitude),
        altitude=float(entity.altitude),
        frequency=float(entity.frequency),
        speed=float(entity.speed),
        bearing=float(entity.bearing),
        ip_address=entity.ip_address,
    )
