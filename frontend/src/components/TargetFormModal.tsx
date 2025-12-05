/**
 * Target Form Modal Component
 *
 * Modal popup for adding or editing targets.
 */

import { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import type {
  TargetDTO,
  TargetCreateDTO,
  TargetUpdateDTO,
} from "../generated/api";

// Common frequency suggestions
const FREQUENCY_OPTIONS = [433, 915, 2.4, 5.2, 5.8];

interface TargetFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: TargetCreateDTO | TargetUpdateDTO) => Promise<void>;
  target: TargetDTO | null;
  submitting: boolean;
}

interface FormData {
  latitude: string;
  longitude: string;
  altitude: string;
  frequency: string;
  speed: string;
  bearing: string;
  ip_address: string;
}

interface FormErrors {
  latitude?: string;
  longitude?: string;
  altitude?: string;
  frequency?: string;
  speed?: string;
  bearing?: string;
  ip_address?: string;
}

const initialFormData: FormData = {
  latitude: "",
  longitude: "",
  altitude: "",
  frequency: "",
  speed: "",
  bearing: "",
  ip_address: "",
};

export default function TargetFormModal({
  show,
  onHide,
  onSubmit,
  target,
  submitting,
}: TargetFormModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = target !== null;

  // Reset form when modal opens/closes or target changes
  useEffect(() => {
    if (show && target) {
      setFormData({
        latitude: target.latitude.toString(),
        longitude: target.longitude.toString(),
        altitude: target.altitude.toString(),
        frequency: target.frequency.toString(),
        speed: target.speed.toString(),
        bearing: target.bearing.toString(),
        ip_address: target.ip_address,
      });
    } else if (show) {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [show, target]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Check if current frequency matches a common option
  const isCommonFrequency = FREQUENCY_OPTIONS.some(
    (f) => f.toString() === formData.frequency
  );

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Latitude
    const lat = parseFloat(formData.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = "Must be between -90 and 90";
    }

    // Longitude
    const lon = parseFloat(formData.longitude);
    if (isNaN(lon) || lon < -180 || lon > 180) {
      newErrors.longitude = "Must be between -180 and 180";
    }

    // Altitude
    if (isNaN(parseFloat(formData.altitude))) {
      newErrors.altitude = "Must be a valid number";
    }

    // Frequency
    const freq = parseFloat(formData.frequency);
    if (isNaN(freq) || freq <= 0) {
      newErrors.frequency = "Must be a positive number";
    }

    // Speed
    const speed = parseFloat(formData.speed);
    if (isNaN(speed) || speed < 0) {
      newErrors.speed = "Must be a non-negative number";
    }

    // Bearing
    const bearing = parseFloat(formData.bearing);
    if (isNaN(bearing) || bearing < 0 || bearing > 360) {
      newErrors.bearing = "Must be between 0 and 360";
    }

    // IP Address
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(formData.ip_address)) {
      newErrors.ip_address = "Must be a valid IPv4 address";
    } else {
      const octets = formData.ip_address.split(".");
      if (octets.some((o) => parseInt(o) > 255)) {
        newErrors.ip_address = "Must be a valid IPv4 address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data: TargetCreateDTO = {
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      altitude: parseFloat(formData.altitude),
      frequency: parseFloat(formData.frequency),
      speed: parseFloat(formData.speed),
      bearing: parseFloat(formData.bearing),
      ip_address: formData.ip_address,
    };

    await onSubmit(data);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Target" : "Add New Target"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="latitude">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  isInvalid={!!errors.latitude}
                  step="any"
                  min={-90}
                  max={90}
                  placeholder="-90 to 90"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.latitude}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="longitude">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  isInvalid={!!errors.longitude}
                  step="any"
                  min={-180}
                  max={180}
                  placeholder="-180 to 180"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.longitude}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="altitude">
                <Form.Label>Altitude (m)</Form.Label>
                <Form.Control
                  type="number"
                  name="altitude"
                  value={formData.altitude}
                  onChange={handleChange}
                  isInvalid={!!errors.altitude}
                  step="any"
                  placeholder="Altitude in meters"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.altitude}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="frequency">
                <Form.Label>Frequency (MHz/GHz)</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="number"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    isInvalid={!!errors.frequency}
                    step="any"
                    min={0}
                    placeholder="Enter or select frequency"
                    list="frequency-options"
                  />
                  <Form.Select
                    className="flex-shrink-1"
                    style={{ maxWidth: '140px' }}
                    value={isCommonFrequency ? formData.frequency : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setFormData((prev) => ({ ...prev, frequency: e.target.value }));
                        if (errors.frequency) {
                          setErrors((prev) => ({ ...prev, frequency: undefined }));
                        }
                      }
                    }}
                  >
                    <option value="">Common...</option>
                    {FREQUENCY_OPTIONS.map((freq) => (
                      <option key={freq} value={freq}>
                        {freq} {freq >= 100 ? 'MHz' : 'GHz'}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                {errors.frequency && (
                  <div className="invalid-feedback d-block">
                    {errors.frequency}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="speed">
                <Form.Label>Speed (m/s)</Form.Label>
                <Form.Control
                  type="number"
                  name="speed"
                  value={formData.speed}
                  onChange={handleChange}
                  isInvalid={!!errors.speed}
                  step="any"
                  min={0}
                  placeholder="Speed in m/s"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.speed}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="bearing">
                <Form.Label>Bearing (°)</Form.Label>
                <Form.Control
                  type="number"
                  name="bearing"
                  value={formData.bearing}
                  onChange={handleChange}
                  isInvalid={!!errors.bearing}
                  step="any"
                  min={0}
                  max={360}
                  placeholder="0 to 360"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.bearing}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="ip_address">
            <Form.Label>IP Address</Form.Label>
            <Form.Control
              type="text"
              name="ip_address"
              value={formData.ip_address}
              onChange={handleChange}
              isInvalid={!!errors.ip_address}
              placeholder="e.g., 192.168.1.1"
            />
            <Form.Control.Feedback type="invalid">
              {errors.ip_address}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Create Target"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
