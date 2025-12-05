import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import type { Target, TargetFormData } from '../types/Target';
import { FREQUENCY_OPTIONS, emptyFormData } from '../types/Target';

interface TargetFormProps {
  target?: Target | null;
  onSubmit: (data: TargetFormData) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export function TargetForm({ target, onSubmit, onCancel, isEditing }: TargetFormProps) {
  const [formData, setFormData] = useState<TargetFormData>(emptyFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (target) {
      setFormData({
        latitude: target.latitude.toString(),
        longitude: target.longitude.toString(),
        altitude: target.altitude.toString(),
        frequency: target.frequency.toString(),
        speed: target.speed.toString(),
        bearing: target.bearing.toString(),
        ip_address: target.ip_address,
      });
    } else {
      setFormData(emptyFormData);
    }
    setErrors({});
    setSubmitError('');
  }, [target]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const lat = parseFloat(formData.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = 'Must be between -90 and 90';
    }

    const lon = parseFloat(formData.longitude);
    if (isNaN(lon) || lon < -180 || lon > 180) {
      newErrors.longitude = 'Must be between -180 and 180';
    }

    if (isNaN(parseFloat(formData.altitude))) {
      newErrors.altitude = 'Must be a valid number';
    }

    const speed = parseFloat(formData.speed);
    if (isNaN(speed) || speed < 0) {
      newErrors.speed = 'Must be a positive number';
    }

    const bearing = parseFloat(formData.bearing);
    if (isNaN(bearing) || bearing < 0 || bearing > 360) {
      newErrors.bearing = 'Must be between 0 and 360';
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(formData.ip_address)) {
      newErrors.ip_address = 'Must be a valid IPv4 address';
    } else {
      const octets = formData.ip_address.split('.');
      for (const octet of octets) {
        if (parseInt(octet) > 255) {
          newErrors.ip_address = 'Must be a valid IPv4 address';
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h5 className="mb-3">{isEditing ? 'Edit Target' : 'Add New Target'}</h5>
      
      {submitError && <Alert variant="danger">{submitError}</Alert>}

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="latitude">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              isInvalid={!!errors.latitude}
              placeholder="-90 to 90"
            />
            <Form.Control.Feedback type="invalid">{errors.latitude}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="longitude">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              isInvalid={!!errors.longitude}
              placeholder="-180 to 180"
            />
            <Form.Control.Feedback type="invalid">{errors.longitude}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="altitude">
            <Form.Label>Altitude (m)</Form.Label>
            <Form.Control
              type="number"
              step="any"
              name="altitude"
              value={formData.altitude}
              onChange={handleChange}
              isInvalid={!!errors.altitude}
              placeholder="Meters"
            />
            <Form.Control.Feedback type="invalid">{errors.altitude}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="frequency">
            <Form.Label>Frequency</Form.Label>
            <Form.Select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
            >
              {FREQUENCY_OPTIONS.map(freq => (
                <option key={freq} value={freq}>
                  {freq} {freq >= 100 ? 'MHz' : 'GHz'}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="speed">
            <Form.Label>Speed (m/s)</Form.Label>
            <Form.Control
              type="number"
              step="any"
              min="0"
              name="speed"
              value={formData.speed}
              onChange={handleChange}
              isInvalid={!!errors.speed}
              placeholder="Positive number"
            />
            <Form.Control.Feedback type="invalid">{errors.speed}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="bearing">
            <Form.Label>Bearing (°)</Form.Label>
            <Form.Control
              type="number"
              step="any"
              min="0"
              max="360"
              name="bearing"
              value={formData.bearing}
              onChange={handleChange}
              isInvalid={!!errors.bearing}
              placeholder="0 to 360"
            />
            <Form.Control.Feedback type="invalid">{errors.bearing}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="ip_address">
            <Form.Label>IP Address</Form.Label>
            <Form.Control
              type="text"
              name="ip_address"
              value={formData.ip_address}
              onChange={handleChange}
              isInvalid={!!errors.ip_address}
              placeholder="192.168.1.1"
            />
            <Form.Control.Feedback type="invalid">{errors.ip_address}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Target'}
        </Button>
      </div>
    </Form>
  );
}
