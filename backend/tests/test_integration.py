"""
Integration tests for backend API endpoints
"""
import pytest
import json


class TestHealthEndpoint:
    """Tests for /api/health endpoint"""

    def test_health_check(self, client):
        """Test health check returns healthy status"""
        response = client.get('/api/health')
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'healthy'


class TestGetTargets:
    """Tests for GET /api/targets endpoint"""

    def test_get_empty_targets(self, client):
        """Test getting targets when none exist"""
        response = client.get('/api/targets')
        assert response.status_code == 200
        data = response.get_json()
        assert data['targets'] == []
        assert data['count'] == 0

    def test_get_targets_with_data(self, client_with_data):
        """Test getting targets when data exists"""
        client, target_id, _ = client_with_data
        response = client.get('/api/targets')
        assert response.status_code == 200
        data = response.get_json()
        assert data['count'] == 1
        assert len(data['targets']) == 1
        assert data['targets'][0]['id'] == target_id


class TestGetTargetById:
    """Tests for GET /api/targets/<id> endpoint"""

    def test_get_target_by_id(self, client_with_data):
        """Test getting a specific target by ID"""
        client, target_id, sample_target = client_with_data
        response = client.get(f'/api/targets/{target_id}')
        assert response.status_code == 200
        data = response.get_json()
        assert data['id'] == target_id
        assert data['latitude'] == sample_target['latitude']
        assert data['longitude'] == sample_target['longitude']

    def test_get_nonexistent_target(self, client):
        """Test getting a target that doesn't exist"""
        response = client.get('/api/targets/nonexistent-id')
        assert response.status_code == 404
        data = response.get_json()
        assert 'error' in data
        assert data['status'] == 404


class TestCreateTarget:
    """Tests for POST /api/targets endpoint"""

    def test_create_target_success(self, client, sample_target):
        """Test creating a new target successfully"""
        response = client.post('/api/targets', json=sample_target)
        assert response.status_code == 201
        data = response.get_json()
        assert 'id' in data
        assert data['message'] == 'Target created successfully'

        # Verify target was created
        get_response = client.get(f"/api/targets/{data['id']}")
        assert get_response.status_code == 200

    def test_create_target_no_data(self, client):
        """Test creating target with no data"""
        response = client.post('/api/targets', json=None)
        # Flask returns 415 when Content-Type is set but body is empty
        assert response.status_code in [400, 415]

    def test_create_target_missing_fields(self, client):
        """Test creating target with missing required fields"""
        response = client.post('/api/targets', json={'latitude': 32.0})
        assert response.status_code == 400
        data = response.get_json()
        assert data['error'] == 'Validation failed'
        assert 'details' in data

    def test_create_target_invalid_data(self, client, sample_target):
        """Test creating target with invalid data"""
        sample_target['latitude'] = 100  # Invalid
        response = client.post('/api/targets', json=sample_target)
        assert response.status_code == 400
        data = response.get_json()
        assert 'latitude' in data['details']

    def test_create_multiple_targets(self, client, sample_target):
        """Test creating multiple targets"""
        # Create first target
        response1 = client.post('/api/targets', json=sample_target)
        assert response1.status_code == 201

        # Create second target with different data
        sample_target['ip_address'] = '192.168.1.2'
        response2 = client.post('/api/targets', json=sample_target)
        assert response2.status_code == 201

        # Verify both exist
        response = client.get('/api/targets')
        data = response.get_json()
        assert data['count'] == 2


class TestUpdateTarget:
    """Tests for PUT /api/targets/<id> endpoint"""

    def test_update_target_success(self, client_with_data):
        """Test updating a target successfully"""
        client, target_id, _ = client_with_data
        update_data = {'speed': 50.0, 'bearing': 270.0}
        response = client.put(f'/api/targets/{target_id}', json=update_data)
        assert response.status_code == 200
        data = response.get_json()
        assert data['message'] == 'Target updated successfully'

        # Verify update
        get_response = client.get(f'/api/targets/{target_id}')
        target = get_response.get_json()
        assert target['speed'] == 50.0
        assert target['bearing'] == 270.0

    def test_update_target_partial(self, client_with_data):
        """Test partial update only changes specified fields"""
        client, target_id, sample_target = client_with_data
        original_lat = sample_target['latitude']
        
        update_data = {'speed': 100.0}
        response = client.put(f'/api/targets/{target_id}', json=update_data)
        assert response.status_code == 200

        # Verify only speed changed
        get_response = client.get(f'/api/targets/{target_id}')
        target = get_response.get_json()
        assert target['speed'] == 100.0
        assert target['latitude'] == original_lat

    def test_update_nonexistent_target(self, client):
        """Test updating a target that doesn't exist"""
        response = client.put('/api/targets/nonexistent-id', json={'speed': 50.0})
        assert response.status_code == 404

    def test_update_target_invalid_data(self, client_with_data):
        """Test updating with invalid data"""
        client, target_id, _ = client_with_data
        response = client.put(f'/api/targets/{target_id}', json={'bearing': 400})
        assert response.status_code == 400

    def test_update_target_no_data(self, client_with_data):
        """Test updating with no data"""
        client, target_id, _ = client_with_data
        response = client.put(f'/api/targets/{target_id}', json=None)
        # Flask returns 415 when Content-Type is set but body is empty
        assert response.status_code in [400, 415]


class TestDeleteTarget:
    """Tests for DELETE /api/targets/<id> endpoint"""

    def test_delete_target_success(self, client_with_data):
        """Test deleting a target successfully"""
        client, target_id, _ = client_with_data
        response = client.delete(f'/api/targets/{target_id}')
        assert response.status_code == 200
        data = response.get_json()
        assert data['message'] == 'Target deleted successfully'

        # Verify deletion
        get_response = client.get(f'/api/targets/{target_id}')
        assert get_response.status_code == 404

    def test_delete_nonexistent_target(self, client):
        """Test deleting a target that doesn't exist"""
        response = client.delete('/api/targets/nonexistent-id')
        assert response.status_code == 404

    def test_delete_target_removes_from_list(self, client, sample_target):
        """Test deleted target is removed from list"""
        # Create two targets
        response1 = client.post('/api/targets', json=sample_target)
        id1 = response1.get_json()['id']
        
        sample_target['ip_address'] = '192.168.1.2'
        response2 = client.post('/api/targets', json=sample_target)
        id2 = response2.get_json()['id']

        # Delete first target
        client.delete(f'/api/targets/{id1}')

        # Verify only second target remains
        response = client.get('/api/targets')
        data = response.get_json()
        assert data['count'] == 1
        assert data['targets'][0]['id'] == id2


class TestCRUDWorkflow:
    """End-to-end workflow tests"""

    def test_full_crud_workflow(self, client, sample_target):
        """Test complete Create-Read-Update-Delete workflow"""
        # CREATE
        create_response = client.post('/api/targets', json=sample_target)
        assert create_response.status_code == 201
        target_id = create_response.get_json()['id']

        # READ
        read_response = client.get(f'/api/targets/{target_id}')
        assert read_response.status_code == 200
        target = read_response.get_json()
        assert target['latitude'] == sample_target['latitude']

        # UPDATE
        update_response = client.put(f'/api/targets/{target_id}', json={'speed': 99.9})
        assert update_response.status_code == 200

        # Verify update
        verify_response = client.get(f'/api/targets/{target_id}')
        assert verify_response.get_json()['speed'] == 99.9

        # DELETE
        delete_response = client.delete(f'/api/targets/{target_id}')
        assert delete_response.status_code == 200

        # Verify deletion
        final_response = client.get(f'/api/targets/{target_id}')
        assert final_response.status_code == 404
