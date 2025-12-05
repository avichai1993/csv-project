"""
Pytest fixtures for backend tests
"""
import os
import tempfile
import pytest
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, CSV_FILE, init_csv, write_targets


@pytest.fixture
def client():
    """Create a test client with a temporary CSV file."""
    # Create a temporary file for testing
    fd, temp_path = tempfile.mkstemp(suffix='.csv')
    os.close(fd)
    
    # Patch the CSV_FILE path
    import app as app_module
    original_csv_file = app_module.CSV_FILE
    app_module.CSV_FILE = temp_path
    
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        # Initialize empty CSV
        app_module.init_csv()
        yield client
    
    # Cleanup
    app_module.CSV_FILE = original_csv_file
    if os.path.exists(temp_path):
        os.remove(temp_path)


@pytest.fixture
def sample_target():
    """Return a valid sample target data."""
    return {
        'latitude': 32.0853,
        'longitude': 34.7818,
        'altitude': 150.5,
        'frequency': 2.4,
        'speed': 25.0,
        'bearing': 180.0,
        'ip_address': '192.168.1.1'
    }


@pytest.fixture
def client_with_data(client, sample_target):
    """Create a test client with pre-populated data."""
    # Create a target first
    response = client.post('/api/targets', json=sample_target)
    target_id = response.get_json()['id']
    return client, target_id, sample_target
