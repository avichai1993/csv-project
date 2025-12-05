"""Target Service - Business Logic Layer.

This service contains all business logic for target operations.
It uses only plain objects (Target, TargetCreate, TargetUpdate).
"""

import logging
import uuid
from typing import Optional

from src.models.target import Target, TargetCreate, TargetUpdate
from src.dal.target_repository import TargetRepository

logger = logging.getLogger(__name__)


class TargetService:
    """Business logic service for Target operations."""

    def __init__(self, repository: Optional[TargetRepository] = None):
        """Initialize service with repository.
        
        Args:
            repository: TargetRepository instance (creates default if None)
        """
        self.repository = repository or TargetRepository()

    def get_all(self) -> list[Target]:
        """Get all targets.
        
        Returns:
            List of all Target objects
        """
        logger.debug("BL: Getting all targets")
        return self.repository.get_all()

    def get_by_id(self, target_id: str) -> Optional[Target]:
        """Get a target by ID.
        
        Args:
            target_id: UUID of the target
            
        Returns:
            Target if found, None otherwise
        """
        logger.debug(f"BL: Getting target by ID: {target_id}")
        return self.repository.get_by_id(target_id)

    def create(self, data: TargetCreate) -> Target:
        """Create a new target.
        
        Args:
            data: TargetCreate data (without ID)
            
        Returns:
            The created Target with generated ID
        """
        logger.info("BL: Creating new target")
        
        # Generate new UUID
        target_id = str(uuid.uuid4())
        
        # Create full Target object
        target = Target(
            id=target_id,
            latitude=data.latitude,
            longitude=data.longitude,
            altitude=data.altitude,
            frequency=data.frequency,
            speed=data.speed,
            bearing=data.bearing,
            ip_address=data.ip_address,
        )
        
        return self.repository.create(target)

    def update(self, target_id: str, data: TargetUpdate) -> Optional[Target]:
        """Update an existing target.
        
        Args:
            target_id: UUID of the target to update
            data: TargetUpdate with fields to update
            
        Returns:
            Updated Target if found, None otherwise
        """
        logger.info(f"BL: Updating target: {target_id}")
        
        # Get existing target
        existing = self.repository.get_by_id(target_id)
        if not existing:
            logger.warning(f"BL: Target not found: {target_id}")
            return None
        
        # Apply updates
        updated = Target(
            id=existing.id,
            latitude=data.latitude if data.latitude is not None else existing.latitude,
            longitude=data.longitude if data.longitude is not None else existing.longitude,
            altitude=data.altitude if data.altitude is not None else existing.altitude,
            frequency=data.frequency if data.frequency is not None else existing.frequency,
            speed=data.speed if data.speed is not None else existing.speed,
            bearing=data.bearing if data.bearing is not None else existing.bearing,
            ip_address=data.ip_address if data.ip_address is not None else existing.ip_address,
        )
        
        return self.repository.update(updated)

    def delete(self, target_id: str) -> Optional[Target]:
        """Delete a target.
        
        Args:
            target_id: UUID of the target to delete
            
        Returns:
            Deleted Target if found, None otherwise
        """
        logger.info(f"BL: Deleting target: {target_id}")
        return self.repository.delete(target_id)
