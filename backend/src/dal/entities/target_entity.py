"""Target Entity for CSV storage interaction.

This class has the Entity suffix and is used exclusively in the DAL layer
for reading from and writing to the CSV file.
"""

from dataclasses import dataclass


@dataclass
class TargetEntity:
    """Entity class for CSV storage.
    
    All fields are stored as strings in CSV format.
    Conversion to/from proper types happens in the entity converter.
    """

    id: str
    latitude: str
    longitude: str
    altitude: str
    frequency: str
    speed: str
    bearing: str
    ip_address: str

    @classmethod
    def csv_headers(cls) -> list[str]:
        """Return CSV column headers in order."""
        return [
            "id",
            "latitude",
            "longitude",
            "altitude",
            "frequency",
            "speed",
            "bearing",
            "ip_address",
        ]

    def to_csv_row(self) -> list[str]:
        """Convert entity to CSV row values."""
        return [
            self.id,
            self.latitude,
            self.longitude,
            self.altitude,
            self.frequency,
            self.speed,
            self.bearing,
            self.ip_address,
        ]

    @classmethod
    def from_csv_row(cls, row: dict[str, str]) -> "TargetEntity":
        """Create entity from CSV row dictionary."""
        return cls(
            id=row["id"],
            latitude=row["latitude"],
            longitude=row["longitude"],
            altitude=row["altitude"],
            frequency=row["frequency"],
            speed=row["speed"],
            bearing=row["bearing"],
            ip_address=row["ip_address"],
        )
