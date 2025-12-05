import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TargetList from './TargetList';
import type { TargetDTO } from '../generated/api';

// Mock targets for testing
const mockTargets: TargetDTO[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    latitude: 32.0853,
    longitude: 34.7818,
    altitude: 150.5,
    frequency: 2.4,
    speed: 50.0,
    bearing: 180.0,
    ip_address: '192.168.1.1',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    latitude: 31.7683,
    longitude: 35.2137,
    altitude: 800.0,
    frequency: 5.8,
    speed: 120.5,
    bearing: 270.0,
    ip_address: '192.168.1.2',
  },
];

describe('TargetList', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders target list with data', () => {
    render(
      <TargetList
        targets={mockTargets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Check table headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Coordinates')).toBeInTheDocument();
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();

    // Check target data is displayed
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.2')).toBeInTheDocument();
  });

  it('displays frequency with correct unit (MHz/GHz)', () => {
    render(
      <TargetList
        targets={mockTargets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // 2.4 should show as GHz, 5.8 should show as GHz
    expect(screen.getByText('2.4 GHz')).toBeInTheDocument();
    expect(screen.getByText('5.8 GHz')).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TargetList
        targets={mockTargets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByTitle('Edit target');
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTargets[0]);
  });

  it('calls onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TargetList
        targets={mockTargets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByTitle('Delete target');
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTargets[0]);
  });

  it('truncates long IDs', () => {
    render(
      <TargetList
        targets={mockTargets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // ID should be truncated to first 8 chars + ...
    const truncatedIds = screen.getAllByText(/550e8400\.\.\./);
    expect(truncatedIds.length).toBe(2);
  });

  it('displays coordinates with correct precision', () => {
    render(
      <TargetList
        targets={mockTargets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/32\.0853, 34\.7818/)).toBeInTheDocument();
  });

  it('displays altitude with unit', () => {
    render(
      <TargetList
        targets={mockTargets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('150.5 m')).toBeInTheDocument();
  });

  it('displays bearing with degree symbol', () => {
    render(
      <TargetList
        targets={mockTargets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('180.0°')).toBeInTheDocument();
  });
});
