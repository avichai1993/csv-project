import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmModal from './DeleteConfirmModal';
import type { TargetDTO } from '../generated/api';

describe('DeleteConfirmModal', () => {
  const mockOnConfirm = vi.fn().mockResolvedValue(undefined);
  const mockOnHide = vi.fn();
  
  const testTarget: TargetDTO = {
    id: 'test-target-id-123',
    latitude: 32.0853,
    longitude: 34.7818,
    altitude: 150.5,
    frequency: 2.4,
    speed: 50.0,
    bearing: 180.0,
    ip_address: '192.168.1.1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when show is true', () => {
    render(
      <DeleteConfirmModal
        show={true}
        target={testTarget}
        onConfirm={mockOnConfirm}
        onHide={mockOnHide}
        submitting={false}
      />
    );

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
  });

  it('does not render modal when show is false', () => {
    render(
      <DeleteConfirmModal
        show={false}
        target={testTarget}
        onConfirm={mockOnConfirm}
        onHide={mockOnHide}
        submitting={false}
      />
    );

    expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
  });

  it('displays target details in modal', () => {
    render(
      <DeleteConfirmModal
        show={true}
        target={testTarget}
        onConfirm={mockOnConfirm}
        onHide={mockOnHide}
        submitting={false}
      />
    );

    expect(screen.getByText(testTarget.id)).toBeInTheDocument();
    expect(screen.getByText(testTarget.ip_address)).toBeInTheDocument();
  });

  it('calls onConfirm when Delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DeleteConfirmModal
        show={true}
        target={testTarget}
        onConfirm={mockOnConfirm}
        onHide={mockOnHide}
        submitting={false}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete target/i });
    await user.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onHide when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DeleteConfirmModal
        show={true}
        target={testTarget}
        onConfirm={mockOnConfirm}
        onHide={mockOnHide}
        submitting={false}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });

  it('has Cancel and Delete buttons', () => {
    render(
      <DeleteConfirmModal
        show={true}
        target={testTarget}
        onConfirm={mockOnConfirm}
        onHide={mockOnHide}
        submitting={false}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete target/i })).toBeInTheDocument();
  });

  it('disables buttons when submitting', () => {
    render(
      <DeleteConfirmModal
        show={true}
        target={testTarget}
        onConfirm={mockOnConfirm}
        onHide={mockOnHide}
        submitting={true}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /deleting/i })).toBeDisabled();
  });
});
