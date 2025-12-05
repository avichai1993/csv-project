import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TargetForm } from './TargetForm';
import { mockSingleTarget } from '../test/mocks/api';

describe('TargetForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  describe('Add Mode', () => {
    it('renders empty form for new target', () => {
      render(
        <TargetForm
          target={null}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={false}
        />
      );

      expect(screen.getByText('Add New Target')).toBeInTheDocument();
      expect(screen.getByLabelText(/latitude/i)).toHaveValue(null);
      expect(screen.getByLabelText(/longitude/i)).toHaveValue(null);
    });

    it('shows Create Target button in add mode', () => {
      render(
        <TargetForm
          target={null}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={false}
        />
      );

      expect(screen.getByRole('button', { name: /create target/i })).toBeInTheDocument();
    });

    it('has frequency dropdown with all options', () => {
      render(
        <TargetForm
          target={null}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={false}
        />
      );

      const frequencySelect = screen.getByLabelText(/frequency/i);
      expect(frequencySelect).toBeInTheDocument();
      
      // Check all frequency options exist
      expect(screen.getByText('433 MHz')).toBeInTheDocument();
      expect(screen.getByText('915 MHz')).toBeInTheDocument();
      expect(screen.getByText('2.4 GHz')).toBeInTheDocument();
      expect(screen.getByText('5.2 GHz')).toBeInTheDocument();
      expect(screen.getByText('5.8 GHz')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('populates form with target data', () => {
      render(
        <TargetForm
          target={mockSingleTarget}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={true}
        />
      );

      expect(screen.getByText('Edit Target')).toBeInTheDocument();
      expect(screen.getByLabelText(/latitude/i)).toHaveValue(mockSingleTarget.latitude);
      expect(screen.getByLabelText(/longitude/i)).toHaveValue(mockSingleTarget.longitude);
      expect(screen.getByLabelText(/altitude/i)).toHaveValue(mockSingleTarget.altitude);
      expect(screen.getByLabelText(/speed/i)).toHaveValue(mockSingleTarget.speed);
      expect(screen.getByLabelText(/bearing/i)).toHaveValue(mockSingleTarget.bearing);
      expect(screen.getByLabelText(/ip address/i)).toHaveValue(mockSingleTarget.ip_address);
    });

    it('shows Save Changes button in edit mode', () => {
      render(
        <TargetForm
          target={mockSingleTarget}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={true}
        />
      );

      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('shows error for invalid latitude', async () => {
      const user = userEvent.setup();
      render(
        <TargetForm
          target={null}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={false}
        />
      );

      const latitudeInput = screen.getByLabelText(/latitude/i);
      await user.clear(latitudeInput);
      await user.type(latitudeInput, '100');

      // Fill other required fields
      await user.type(screen.getByLabelText(/longitude/i), '34');
      await user.type(screen.getByLabelText(/altitude/i), '100');
      await user.type(screen.getByLabelText(/speed/i), '25');
      await user.type(screen.getByLabelText(/bearing/i), '180');
      await user.type(screen.getByLabelText(/ip address/i), '192.168.1.1');

      const submitButton = screen.getByRole('button', { name: /create target/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/must be between -90 and 90/i)).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows error for invalid IP address', async () => {
      const user = userEvent.setup();
      render(
        <TargetForm
          target={null}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={false}
        />
      );

      await user.type(screen.getByLabelText(/latitude/i), '32');
      await user.type(screen.getByLabelText(/longitude/i), '34');
      await user.type(screen.getByLabelText(/altitude/i), '100');
      await user.type(screen.getByLabelText(/speed/i), '25');
      await user.type(screen.getByLabelText(/bearing/i), '180');
      await user.type(screen.getByLabelText(/ip address/i), 'invalid-ip');

      const submitButton = screen.getByRole('button', { name: /create target/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/must be a valid ipv4 address/i)).toBeInTheDocument();
      });
    });

    it('validates speed is positive', () => {
      render(
        <TargetForm
          target={null}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={false}
        />
      );

      // Speed input should have min="0" attribute for positive numbers
      const speedInput = screen.getByLabelText(/speed/i);
      expect(speedInput).toHaveAttribute('min', '0');
    });

    it('validates bearing range', () => {
      render(
        <TargetForm
          target={null}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={false}
        />
      );

      // Bearing input should have min and max attributes
      const bearingInput = screen.getByLabelText(/bearing/i);
      expect(bearingInput).toHaveAttribute('min', '0');
      expect(bearingInput).toHaveAttribute('max', '360');
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with form data on valid submission', async () => {
      const user = userEvent.setup();
      render(
        <TargetForm
          target={null}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={false}
        />
      );

      await user.type(screen.getByLabelText(/latitude/i), '32.0853');
      await user.type(screen.getByLabelText(/longitude/i), '34.7818');
      await user.type(screen.getByLabelText(/altitude/i), '150.5');
      await user.type(screen.getByLabelText(/speed/i), '25');
      await user.type(screen.getByLabelText(/bearing/i), '180');
      await user.type(screen.getByLabelText(/ip address/i), '192.168.1.1');

      const submitButton = screen.getByRole('button', { name: /create target/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
          latitude: '32.0853',
          longitude: '34.7818',
          altitude: '150.5',
          speed: '25',
          bearing: '180',
          ip_address: '192.168.1.1',
        }));
      });
    });

    it('calls onCancel when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TargetForm
          target={null}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={false}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('disables buttons while submitting', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(
        <TargetForm
          target={null}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isEditing={false}
        />
      );

      await user.type(screen.getByLabelText(/latitude/i), '32');
      await user.type(screen.getByLabelText(/longitude/i), '34');
      await user.type(screen.getByLabelText(/altitude/i), '100');
      await user.type(screen.getByLabelText(/speed/i), '25');
      await user.type(screen.getByLabelText(/bearing/i), '180');
      await user.type(screen.getByLabelText(/ip address/i), '192.168.1.1');

      const submitButton = screen.getByRole('button', { name: /create target/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
      });
    });
  });
});
