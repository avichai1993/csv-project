/**
 * Delete Confirmation Modal
 *
 * Shows target details and asks for confirmation before deletion.
 */

import { Modal, Button, Spinner, Table } from 'react-bootstrap';
import type { TargetDTO } from '../generated/api';

interface DeleteConfirmModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => Promise<void>;
  target: TargetDTO | null;
  submitting: boolean;
}

export default function DeleteConfirmModal({
  show,
  onHide,
  onConfirm,
  target,
  submitting,
}: DeleteConfirmModalProps) {
  if (!target) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this target? This action cannot be undone.</p>
        
        <Table size="sm" className="mt-3">
          <tbody>
            <tr>
              <td className="fw-bold">ID</td>
              <td><code>{target.id}</code></td>
            </tr>
            <tr>
              <td className="fw-bold">Coordinates</td>
              <td>{target.latitude.toFixed(4)}, {target.longitude.toFixed(4)}</td>
            </tr>
            <tr>
              <td className="fw-bold">Altitude</td>
              <td>{target.altitude.toFixed(1)} m</td>
            </tr>
            <tr>
              <td className="fw-bold">Frequency</td>
              <td>{target.frequency} {target.frequency >= 100 ? 'MHz' : 'GHz'}</td>
            </tr>
            <tr>
              <td className="fw-bold">Speed</td>
              <td>{target.speed.toFixed(1)} m/s</td>
            </tr>
            <tr>
              <td className="fw-bold">Bearing</td>
              <td>{target.bearing.toFixed(1)}°</td>
            </tr>
            <tr>
              <td className="fw-bold">IP Address</td>
              <td><code>{target.ip_address}</code></td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={submitting}>
          {submitting ? (
            <>
              <Spinner size="sm" className="me-2" />
              Deleting...
            </>
          ) : (
            'Delete Target'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
