"""
Target Management System - Flask REST API
"""
import csv
import os
import uuid
import re
from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger

app = Flask(__name__)
CORS(app)

# Swagger/OpenAPI configuration
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/apispec.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/api/docs"
}

swagger_template = {
    "openapi": "3.0.3",
    "info": {
        "title": "Target Management API",
        "description": "RESTful API for managing Target objects with CSV storage",
        "version": "1.0.0"
    },
    "servers": [
        {"url": "http://localhost:5000", "description": "Local development"},
        {"url": "http://3.70.226.142:5000", "description": "Production"}
    ]
}

swagger = Swagger(app, config=swagger_config, template=swagger_template)

# CSV file path
CSV_FILE = os.path.join(os.path.dirname(__file__), 'targets.csv')
CSV_HEADERS = ['id', 'latitude', 'longitude', 'altitude', 'frequency', 'speed', 'bearing', 'ip_address']

# Valid frequency options
VALID_FREQUENCIES = [433, 915, 2.4, 5.2, 5.8]


def init_csv():
    """Initialize CSV file with headers if it doesn't exist."""
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
            writer.writeheader()


def read_targets():
    """Read all targets from CSV file."""
    init_csv()
    targets = []
    with open(CSV_FILE, 'r', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            targets.append({
                'id': row['id'],
                'latitude': float(row['latitude']),
                'longitude': float(row['longitude']),
                'altitude': float(row['altitude']),
                'frequency': float(row['frequency']),
                'speed': float(row['speed']),
                'bearing': float(row['bearing']),
                'ip_address': row['ip_address']
            })
    return targets


def write_targets(targets):
    """Write all targets to CSV file."""
    with open(CSV_FILE, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
        writer.writeheader()
        for target in targets:
            writer.writerow(target)


def validate_target(data, partial=False):
    """Validate target data. Returns (is_valid, errors)."""
    errors = {}
    
    # Latitude validation
    if 'latitude' in data:
        try:
            lat = float(data['latitude'])
            if lat < -90 or lat > 90:
                errors['latitude'] = 'Must be between -90 and 90'
        except (ValueError, TypeError):
            errors['latitude'] = 'Must be a valid number'
    elif not partial:
        errors['latitude'] = 'Required field'
    
    # Longitude validation
    if 'longitude' in data:
        try:
            lon = float(data['longitude'])
            if lon < -180 or lon > 180:
                errors['longitude'] = 'Must be between -180 and 180'
        except (ValueError, TypeError):
            errors['longitude'] = 'Must be a valid number'
    elif not partial:
        errors['longitude'] = 'Required field'
    
    # Altitude validation
    if 'altitude' in data:
        try:
            float(data['altitude'])
        except (ValueError, TypeError):
            errors['altitude'] = 'Must be a valid number'
    elif not partial:
        errors['altitude'] = 'Required field'
    
    # Frequency validation
    if 'frequency' in data:
        try:
            freq = float(data['frequency'])
            if freq not in VALID_FREQUENCIES:
                errors['frequency'] = f'Must be one of: {VALID_FREQUENCIES}'
        except (ValueError, TypeError):
            errors['frequency'] = 'Must be a valid number'
    elif not partial:
        errors['frequency'] = 'Required field'
    
    # Speed validation
    if 'speed' in data:
        try:
            speed = float(data['speed'])
            if speed < 0:
                errors['speed'] = 'Must be a positive number'
        except (ValueError, TypeError):
            errors['speed'] = 'Must be a valid number'
    elif not partial:
        errors['speed'] = 'Required field'
    
    # Bearing validation
    if 'bearing' in data:
        try:
            bearing = float(data['bearing'])
            if bearing < 0 or bearing > 360:
                errors['bearing'] = 'Must be between 0 and 360'
        except (ValueError, TypeError):
            errors['bearing'] = 'Must be a valid number'
    elif not partial:
        errors['bearing'] = 'Required field'
    
    # IP Address validation
    if 'ip_address' in data:
        ip_pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
        if not re.match(ip_pattern, str(data['ip_address'])):
            errors['ip_address'] = 'Must be a valid IPv4 address'
        else:
            # Check each octet is 0-255
            octets = str(data['ip_address']).split('.')
            for octet in octets:
                if int(octet) > 255:
                    errors['ip_address'] = 'Must be a valid IPv4 address'
                    break
    elif not partial:
        errors['ip_address'] = 'Required field'
    
    return len(errors) == 0, errors


@app.route('/api/targets', methods=['GET'])
def get_targets():
    """Get all targets
    ---
    tags:
      - Targets
    responses:
      200:
        description: List of all targets
        content:
          application/json:
            schema:
              type: object
              properties:
                targets:
                  type: array
                  items:
                    $ref: '#/components/schemas/Target'
                count:
                  type: integer
    """
    targets = read_targets()
    return jsonify({'targets': targets, 'count': len(targets)})


@app.route('/api/targets/<target_id>', methods=['GET'])
def get_target(target_id):
    """Get a single target by ID
    ---
    tags:
      - Targets
    parameters:
      - name: target_id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      200:
        description: Target details
      404:
        description: Target not found
    """
    targets = read_targets()
    for target in targets:
        if target['id'] == target_id:
            return jsonify(target)
    return jsonify({'error': 'Target not found', 'status': 404}), 404


@app.route('/api/targets', methods=['POST'])
def create_target():
    """Create a new target
    ---
    tags:
      - Targets
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/TargetCreate'
    responses:
      201:
        description: Target created successfully
      400:
        description: Validation error
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided', 'status': 400}), 400
    
    is_valid, errors = validate_target(data)
    if not is_valid:
        return jsonify({'error': 'Validation failed', 'details': errors, 'status': 400}), 400
    
    new_target = {
        'id': str(uuid.uuid4()),
        'latitude': float(data['latitude']),
        'longitude': float(data['longitude']),
        'altitude': float(data['altitude']),
        'frequency': float(data['frequency']),
        'speed': float(data['speed']),
        'bearing': float(data['bearing']),
        'ip_address': data['ip_address']
    }
    
    targets = read_targets()
    targets.append(new_target)
    write_targets(targets)
    
    return jsonify({'id': new_target['id'], 'message': 'Target created successfully'}), 201


@app.route('/api/targets/<target_id>', methods=['PUT'])
def update_target(target_id):
    """Update an existing target
    ---
    tags:
      - Targets
    parameters:
      - name: target_id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/TargetUpdate'
    responses:
      200:
        description: Target updated successfully
      400:
        description: Validation error
      404:
        description: Target not found
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided', 'status': 400}), 400
    
    is_valid, errors = validate_target(data, partial=True)
    if not is_valid:
        return jsonify({'error': 'Validation failed', 'details': errors, 'status': 400}), 400
    
    targets = read_targets()
    target_found = False
    
    for i, target in enumerate(targets):
        if target['id'] == target_id:
            target_found = True
            # Update only provided fields
            if 'latitude' in data:
                targets[i]['latitude'] = float(data['latitude'])
            if 'longitude' in data:
                targets[i]['longitude'] = float(data['longitude'])
            if 'altitude' in data:
                targets[i]['altitude'] = float(data['altitude'])
            if 'frequency' in data:
                targets[i]['frequency'] = float(data['frequency'])
            if 'speed' in data:
                targets[i]['speed'] = float(data['speed'])
            if 'bearing' in data:
                targets[i]['bearing'] = float(data['bearing'])
            if 'ip_address' in data:
                targets[i]['ip_address'] = data['ip_address']
            break
    
    if not target_found:
        return jsonify({'error': 'Target not found', 'status': 404}), 404
    
    write_targets(targets)
    return jsonify({'message': 'Target updated successfully'})


@app.route('/api/targets/<target_id>', methods=['DELETE'])
def delete_target(target_id):
    """Delete a target
    ---
    tags:
      - Targets
    parameters:
      - name: target_id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      200:
        description: Target deleted successfully
      404:
        description: Target not found
    """
    targets = read_targets()
    original_count = len(targets)
    targets = [t for t in targets if t['id'] != target_id]
    
    if len(targets) == original_count:
        return jsonify({'error': 'Target not found', 'status': 404}), 404
    
    write_targets(targets)
    return jsonify({'message': 'Target deleted successfully'})


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint
    ---
    tags:
      - System
    responses:
      200:
        description: Service is healthy
    """
    return jsonify({'status': 'healthy'})


if __name__ == '__main__':
    init_csv()
    app.run(host='0.0.0.0', port=5000, debug=True)
