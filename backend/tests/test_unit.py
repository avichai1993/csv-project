"""
Unit tests for backend validation and utility functions
"""
import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import validate_target, VALID_FREQUENCIES
from models import TargetCreate, TargetUpdate, VALID_FREQUENCIES as MODEL_FREQUENCIES


class TestValidateTarget:
    """Unit tests for validate_target function"""

    def test_valid_target(self, sample_target):
        """Test validation passes for valid target data"""
        is_valid, errors = validate_target(sample_target)
        assert is_valid is True
        assert errors == {}

    def test_missing_required_fields(self):
        """Test validation fails when required fields are missing"""
        is_valid, errors = validate_target({})
        assert is_valid is False
        assert 'latitude' in errors
        assert 'longitude' in errors
        assert 'altitude' in errors
        assert 'frequency' in errors
        assert 'speed' in errors
        assert 'bearing' in errors
        assert 'ip_address' in errors

    def test_partial_update_allows_missing_fields(self, sample_target):
        """Test partial validation allows missing fields"""
        partial_data = {'speed': 30.0}
        is_valid, errors = validate_target(partial_data, partial=True)
        assert is_valid is True
        assert errors == {}

    def test_latitude_out_of_range(self, sample_target):
        """Test latitude must be between -90 and 90"""
        sample_target['latitude'] = 100
        is_valid, errors = validate_target(sample_target)
        assert is_valid is False
        assert 'latitude' in errors

        sample_target['latitude'] = -100
        is_valid, errors = validate_target(sample_target)
        assert is_valid is False
        assert 'latitude' in errors

    def test_longitude_out_of_range(self, sample_target):
        """Test longitude must be between -180 and 180"""
        sample_target['longitude'] = 200
        is_valid, errors = validate_target(sample_target)
        assert is_valid is False
        assert 'longitude' in errors

    def test_invalid_frequency(self, sample_target):
        """Test frequency must be one of valid options"""
        sample_target['frequency'] = 999
        is_valid, errors = validate_target(sample_target)
        assert is_valid is False
        assert 'frequency' in errors

    def test_valid_frequencies(self, sample_target):
        """Test all valid frequency options pass validation"""
        for freq in VALID_FREQUENCIES:
            sample_target['frequency'] = freq
            is_valid, errors = validate_target(sample_target)
            assert is_valid is True, f"Frequency {freq} should be valid"

    def test_negative_speed(self, sample_target):
        """Test speed must be positive"""
        sample_target['speed'] = -10
        is_valid, errors = validate_target(sample_target)
        assert is_valid is False
        assert 'speed' in errors

    def test_bearing_out_of_range(self, sample_target):
        """Test bearing must be between 0 and 360"""
        sample_target['bearing'] = 400
        is_valid, errors = validate_target(sample_target)
        assert is_valid is False
        assert 'bearing' in errors

        sample_target['bearing'] = -10
        is_valid, errors = validate_target(sample_target)
        assert is_valid is False
        assert 'bearing' in errors

    def test_invalid_ip_address_format(self, sample_target):
        """Test IP address must be valid IPv4 format"""
        invalid_ips = ['invalid', '192.168.1', '192.168.1.1.1', 'abc.def.ghi.jkl']
        for ip in invalid_ips:
            sample_target['ip_address'] = ip
            is_valid, errors = validate_target(sample_target)
            assert is_valid is False, f"IP {ip} should be invalid"
            assert 'ip_address' in errors

    def test_ip_address_octet_out_of_range(self, sample_target):
        """Test IP address octets must be 0-255"""
        sample_target['ip_address'] = '256.168.1.1'
        is_valid, errors = validate_target(sample_target)
        assert is_valid is False
        assert 'ip_address' in errors


class TestPydanticModels:
    """Unit tests for Pydantic DTO models"""

    def test_target_create_valid(self, sample_target):
        """Test TargetCreate model with valid data"""
        target = TargetCreate(**sample_target)
        assert target.latitude == sample_target['latitude']
        assert target.longitude == sample_target['longitude']
        assert target.frequency == sample_target['frequency']

    def test_target_create_invalid_latitude(self, sample_target):
        """Test TargetCreate rejects invalid latitude"""
        sample_target['latitude'] = 100
        with pytest.raises(ValueError):
            TargetCreate(**sample_target)

    def test_target_create_invalid_frequency(self, sample_target):
        """Test TargetCreate rejects invalid frequency"""
        sample_target['frequency'] = 999
        with pytest.raises(ValueError):
            TargetCreate(**sample_target)

    def test_target_create_invalid_ip(self, sample_target):
        """Test TargetCreate rejects invalid IP address"""
        sample_target['ip_address'] = 'invalid'
        with pytest.raises(ValueError):
            TargetCreate(**sample_target)

    def test_target_update_partial(self):
        """Test TargetUpdate allows partial data"""
        update = TargetUpdate(speed=30.0)
        assert update.speed == 30.0
        assert update.latitude is None
        assert update.longitude is None

    def test_target_update_validates_provided_fields(self):
        """Test TargetUpdate validates fields that are provided"""
        with pytest.raises(ValueError):
            TargetUpdate(latitude=100)  # Out of range

    def test_model_frequencies_match_app_frequencies(self):
        """Test model and app frequency constants are in sync"""
        assert MODEL_FREQUENCIES == VALID_FREQUENCIES
