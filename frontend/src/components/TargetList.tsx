/**
 * Target List Component
 *
 * Displays targets in a table with edit/delete action icons.
 */

import { Table, Badge, Button } from 'react-bootstrap';
import { Pencil, Trash2 } from 'lucide-react';
import type { TargetDTO } from '../generated/api';

interface TargetListProps {
  targets: TargetDTO[];
  onEdit: (target: TargetDTO) => void;
  onDelete: (target: TargetDTO) => void;
}

export default function TargetList({ targets, onEdit, onDelete }: TargetListProps) {
  const formatFrequency = (freq: number) => {
    return freq >= 100 ? `${freq} MHz` : `${freq} GHz`;
  };

  const truncateId = (id: string) => {
    return id.substring(0, 8) + '...';
  };

  return (
    <div className="w-100">
    <Table striped bordered hover responsive className="w-100">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Coordinates</th>
          <th>Altitude</th>
          <th>Frequency</th>
          <th>Speed</th>
          <th>Bearing</th>
          <th>IP Address</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {targets.map(target => (
          <tr key={target.id}>
            <td>
              <code title={target.id}>{truncateId(target.id)}</code>
            </td>
            <td>
              <small>
                {target.latitude.toFixed(4)}, {target.longitude.toFixed(4)}
              </small>
            </td>
            <td>{target.altitude.toFixed(1)} m</td>
            <td>
              <Badge bg="info">{formatFrequency(target.frequency)}</Badge>
            </td>
            <td>{target.speed.toFixed(1)} m/s</td>
            <td>{target.bearing.toFixed(1)}°</td>
            <td><code>{target.ip_address}</code></td>
            <td className="text-center">
              <Button 
                size="sm" 
                variant="link"
                className="text-primary p-1 me-1"
                onClick={() => onEdit(target)}
                title="Edit target"
              >
                <Pencil size={18} />
              </Button>
              <Button 
                size="sm" 
                variant="link"
                className="text-danger p-1"
                onClick={() => onDelete(target)}
                title="Delete target"
              >
                <Trash2 size={18} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );
}
