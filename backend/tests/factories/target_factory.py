"""Target Factory - Generate random test data using Faker.

This factory creates random but valid Target objects for testing.
All generated values respect the validation constraints.
"""

import uuid
from faker import Faker

from src.models.target import Target, TargetCreate, TargetUpdate
from src.generated.dtos import TargetDTO, TargetCreateDTO
from src.dal.entities.target_entity import TargetEntity

fake = Faker()

# Common frequency values for realistic data
COMMON_FREQUENCIES = [433.0, 915.0, 2.4, 5.2, 5.8]


def _random_latitude() -> float:
    """Generate random latitude between -90 and 90."""
    return round(fake.pyfloat(min_value=-90, max_value=90), 6)


def _random_longitude() -> float:
    """Generate random longitude between -180 and 180."""
    return round(fake.pyfloat(min_value=-180, max_value=180), 6)


def _random_altitude() -> float:
    """Generate random altitude (can be negative for below sea level)."""
    return round(fake.pyfloat(min_value=-500, max_value=50000), 2)


def _random_frequency() -> float:
    """Generate random frequency (positive number)."""
    # 70% chance of common frequency, 30% chance of random
    if fake.random.random() < 0.7:
        return fake.random.choice(COMMON_FREQUENCIES)
    return round(fake.pyfloat(min_value=0.1, max_value=100), 2)


def _random_speed() -> float:
    """Generate random speed (non-negative)."""
    return round(fake.pyfloat(min_value=0, max_value=1000), 2)


def _random_bearing() -> float:
    """Generate random bearing between 0 and 360."""
    return round(fake.pyfloat(min_value=0, max_value=360), 2)


def _random_ip_address() -> str:
    """Generate random valid IPv4 address."""
    return fake.ipv4()


def create_random_target(id: str | None = None) -> Target:
    """Create a random Target plain object.
    
    Args:
        id: Optional UUID string. If None, generates a new one.
        
    Returns:
        Random Target object with valid values
    """
    return Target(
        id=id or str(uuid.uuid4()),
        latitude=_random_latitude(),
        longitude=_random_longitude(),
        altitude=_random_altitude(),
        frequency=_random_frequency(),
        speed=_random_speed(),
        bearing=_random_bearing(),
        ip_address=_random_ip_address(),
    )


def create_random_target_create() -> TargetCreate:
    """Create a random TargetCreate plain object.
    
    Returns:
        Random TargetCreate object with valid values
    """
    return TargetCreate(
        latitude=_random_latitude(),
        longitude=_random_longitude(),
        altitude=_random_altitude(),
        frequency=_random_frequency(),
        speed=_random_speed(),
        bearing=_random_bearing(),
        ip_address=_random_ip_address(),
    )


def create_random_target_update(partial: bool = True) -> TargetUpdate:
    """Create a random TargetUpdate plain object.
    
    Args:
        partial: If True, only some fields are set. If False, all fields are set.
        
    Returns:
        Random TargetUpdate object
    """
    if partial:
        # Randomly select which fields to update
        update = TargetUpdate()
        if fake.random.random() < 0.5:
            update.latitude = _random_latitude()
        if fake.random.random() < 0.5:
            update.longitude = _random_longitude()
        if fake.random.random() < 0.5:
            update.altitude = _random_altitude()
        if fake.random.random() < 0.5:
            update.frequency = _random_frequency()
        if fake.random.random() < 0.5:
            update.speed = _random_speed()
        if fake.random.random() < 0.5:
            update.bearing = _random_bearing()
        if fake.random.random() < 0.5:
            update.ip_address = _random_ip_address()
        
        # Ensure at least one field is set
        if not update.has_updates():
            update.speed = _random_speed()
        
        return update
    else:
        return TargetUpdate(
            latitude=_random_latitude(),
            longitude=_random_longitude(),
            altitude=_random_altitude(),
            frequency=_random_frequency(),
            speed=_random_speed(),
            bearing=_random_bearing(),
            ip_address=_random_ip_address(),
        )


def create_random_target_dto(id: str | None = None) -> TargetDTO:
    """Create a random TargetDTO.
    
    Args:
        id: Optional UUID string. If None, generates a new one.
        
    Returns:
        Random TargetDTO with valid values
    """
    return TargetDTO(
        id=id or str(uuid.uuid4()),
        latitude=_random_latitude(),
        longitude=_random_longitude(),
        altitude=_random_altitude(),
        frequency=_random_frequency(),
        speed=_random_speed(),
        bearing=_random_bearing(),
        ip_address=_random_ip_address(),
    )


def create_random_target_create_dto() -> TargetCreateDTO:
    """Create a random TargetCreateDTO.
    
    Returns:
        Random TargetCreateDTO with valid values
    """
    return TargetCreateDTO(
        latitude=_random_latitude(),
        longitude=_random_longitude(),
        altitude=_random_altitude(),
        frequency=_random_frequency(),
        speed=_random_speed(),
        bearing=_random_bearing(),
        ip_address=_random_ip_address(),
    )


def create_random_target_entity(id: str | None = None) -> TargetEntity:
    """Create a random TargetEntity.
    
    Args:
        id: Optional UUID string. If None, generates a new one.
        
    Returns:
        Random TargetEntity with valid values (all fields as strings)
    """
    return TargetEntity(
        id=id or str(uuid.uuid4()),
        latitude=str(_random_latitude()),
        longitude=str(_random_longitude()),
        altitude=str(_random_altitude()),
        frequency=str(_random_frequency()),
        speed=str(_random_speed()),
        bearing=str(_random_bearing()),
        ip_address=_random_ip_address(),
    )


def create_random_targets(count: int = 5) -> list[Target]:
    """Create a list of random Target objects.
    
    Args:
        count: Number of targets to create
        
    Returns:
        List of random Target objects
    """
    return [create_random_target() for _ in range(count)]
