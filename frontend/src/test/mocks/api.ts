import { vi } from 'vitest';
import type { Target, TargetFormData } from '../../types/Target';

// Sample mock data
export const mockTargets: Target[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    latitude: 32.0853,
    longitude: 34.7818,
    altitude: 150.5,
    frequency: 2.4,
    speed: 25.0,
    bearing: 180.0,
    ip_address: '192.168.1.1',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    latitude: 31.7683,
    longitude: 35.2137,
    altitude: 200.0,
    frequency: 5.8,
    speed: 40.0,
    bearing: 90.0,
    ip_address: '192.168.1.2',
  },
];

export const mockSingleTarget = mockTargets[0];

export const mockNewTargetData: TargetFormData = {
  latitude: '33.0',
  longitude: '35.0',
  altitude: '100.0',
  frequency: '433',
  speed: '30.0',
  bearing: '45.0',
  ip_address: '10.0.0.1',
};

// Mock API functions
export const createMockApi = () => ({
  getAll: vi.fn().mockResolvedValue(mockTargets),
  getById: vi.fn().mockResolvedValue(mockSingleTarget),
  create: vi.fn().mockResolvedValue({ id: 'new-id', message: 'Target created successfully' }),
  update: vi.fn().mockResolvedValue({ message: 'Target updated successfully' }),
  delete: vi.fn().mockResolvedValue({ message: 'Target deleted successfully' }),
});

// Mock the entire api module
export const mockTargetApi = createMockApi();
