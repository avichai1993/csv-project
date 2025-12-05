"""Target Repository - CSV data access operations.

This repository handles all CSV file operations for targets.
It receives plain objects from BL and converts to/from entities internally.
"""

import csv
import logging
import os
from pathlib import Path
from typing import Optional

from src.models.target import Target
from src.dal.entities.target_entity import TargetEntity
from src.dal.converters.entity_converter import plain_to_entity, entity_to_plain

logger = logging.getLogger(__name__)


class TargetRepository:
    """Repository for Target data persistence using CSV storage."""

    def __init__(self, csv_path: str = "./data/targets.csv"):
        """Initialize repository with CSV file path.
        
        Args:
            csv_path: Path to the CSV file for storage
        """
        self.csv_path = Path(csv_path)
        self._ensure_csv_exists()

    def _ensure_csv_exists(self) -> None:
        """Ensure CSV file and directory exist with headers."""
        self.csv_path.parent.mkdir(parents=True, exist_ok=True)
        
        if not self.csv_path.exists():
            logger.info(f"Creating new CSV file: {self.csv_path}")
            with open(self.csv_path, "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(TargetEntity.csv_headers())

    def _read_all_entities(self) -> list[TargetEntity]:
        """Read all entities from CSV file."""
        entities = []
        with open(self.csv_path, "r", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                entities.append(TargetEntity.from_csv_row(row))
        return entities

    def _write_all_entities(self, entities: list[TargetEntity]) -> None:
        """Write all entities to CSV file."""
        with open(self.csv_path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(TargetEntity.csv_headers())
            for entity in entities:
                writer.writerow(entity.to_csv_row())

    def get_all(self) -> list[Target]:
        """Get all targets from storage.
        
        Returns:
            List of plain Target objects
        """
        logger.debug("Fetching all targets from CSV")
        entities = self._read_all_entities()
        targets = [entity_to_plain(e) for e in entities]
        logger.debug(f"Found {len(targets)} targets")
        return targets

    def get_by_id(self, target_id: str) -> Optional[Target]:
        """Get a target by ID.
        
        Args:
            target_id: UUID of the target
            
        Returns:
            Plain Target object if found, None otherwise
        """
        logger.debug(f"Fetching target by ID: {target_id}")
        entities = self._read_all_entities()
        
        for entity in entities:
            if entity.id == target_id:
                logger.debug(f"Found target: {target_id}")
                return entity_to_plain(entity)
        
        logger.debug(f"Target not found: {target_id}")
        return None

    def create(self, target: Target) -> Target:
        """Create a new target.
        
        Args:
            target: Plain Target object to create
            
        Returns:
            The created Target object
        """
        logger.info(f"Creating new target: {target.id}")
        entities = self._read_all_entities()
        
        # Convert plain object to entity
        new_entity = plain_to_entity(target)
        entities.append(new_entity)
        
        self._write_all_entities(entities)
        logger.info(f"Target created successfully: {target.id}")
        return target

    def update(self, target: Target) -> Optional[Target]:
        """Update an existing target.
        
        Args:
            target: Plain Target object with updated values
            
        Returns:
            The updated Target object if found, None otherwise
        """
        logger.info(f"Updating target: {target.id}")
        entities = self._read_all_entities()
        
        for i, entity in enumerate(entities):
            if entity.id == target.id:
                # Convert plain object to entity and replace
                entities[i] = plain_to_entity(target)
                self._write_all_entities(entities)
                logger.info(f"Target updated successfully: {target.id}")
                return target
        
        logger.warning(f"Target not found for update: {target.id}")
        return None

    def delete(self, target_id: str) -> Optional[Target]:
        """Delete a target by ID.
        
        Args:
            target_id: UUID of the target to delete
            
        Returns:
            The deleted Target object if found, None otherwise
        """
        logger.info(f"Deleting target: {target_id}")
        entities = self._read_all_entities()
        
        for i, entity in enumerate(entities):
            if entity.id == target_id:
                # Convert to plain object before removing
                deleted_target = entity_to_plain(entity)
                entities.pop(i)
                self._write_all_entities(entities)
                logger.info(f"Target deleted successfully: {target_id}")
                return deleted_target
        
        logger.warning(f"Target not found for deletion: {target_id}")
        return None
