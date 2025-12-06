/**
 * MSW Request Handlers
 *
 * Intercepts API calls and returns mock data.
 * No changes needed in application code - works transparently.
 * Uses generated types from OpenAPI and factory for test data.
 */

import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import type { TargetDTO, TargetCreateDTO } from '../generated/api';
import { createRandomTarget, createRandomTargets } from '../test/factories/targetFactory';

// Match both relative paths and full URLs (for generated API client)
const API_BASE = '/api/v1';
const API_BASE_FULL = 'http://localhost:5000/api/v1';

// In-memory storage for mock data
let mockTargets: TargetDTO[] = [];

/**
 * Initialize mock data
 */
function initializeMockData(): void {
  if (mockTargets.length === 0) {
    mockTargets = createRandomTargets(5);
  }
}

// Initialize on module load
initializeMockData();

// Handler functions (reusable for both relative and full URL paths)
const healthHandler = () => {
  return HttpResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
};

const getTargetsHandler = () => {
  return HttpResponse.json(mockTargets);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTargetByIdHandler = ({ params }: any) => {
  const id = params.id as string;
  const target = mockTargets.find((t) => t.id === id);

  if (!target) {
    return HttpResponse.json(
      { error: 'Target not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  return HttpResponse.json(target);
};

const createTargetHandler = async ({ request }: { request: Request }) => {
  const body = (await request.json()) as TargetCreateDTO;

  const newTarget: TargetDTO = {
    id: faker.string.uuid(),
    ...body,
  };

  mockTargets.push(newTarget);

  return HttpResponse.json(newTarget, { status: 201 });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateTargetHandler = async ({ params, request }: any) => {
  const id = params.id as string;
  const body = (await request.json()) as Partial<TargetCreateDTO>;

  const index = mockTargets.findIndex((t) => t.id === id);

  if (index === -1) {
    return HttpResponse.json(
      { error: 'Target not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  mockTargets[index] = { ...mockTargets[index], ...body };

  return HttpResponse.json(mockTargets[index]);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteTargetHandler = ({ params }: any) => {
  const id = params.id as string;
  const index = mockTargets.findIndex((t) => t.id === id);

  if (index === -1) {
    return HttpResponse.json(
      { error: 'Target not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  mockTargets.splice(index, 1);

  return new HttpResponse(null, { status: 204 });
};

/**
 * MSW handlers for all API endpoints
 * Includes both relative paths and full URLs to support generated API client
 */
export const handlers = [
  // Health check (relative)
  http.get(`${API_BASE.replace('/v1', '')}/health`, healthHandler),
  // Health check (full URL)
  http.get(`${API_BASE_FULL.replace('/v1', '')}/health`, healthHandler),

  // GET /api/v1/targets (relative)
  http.get(`${API_BASE}/targets`, getTargetsHandler),
  // GET /api/v1/targets (full URL)
  http.get(`${API_BASE_FULL}/targets`, getTargetsHandler),

  // GET /api/v1/targets/:id (relative)
  http.get(`${API_BASE}/targets/:id`, getTargetByIdHandler),
  // GET /api/v1/targets/:id (full URL)
  http.get(`${API_BASE_FULL}/targets/:id`, getTargetByIdHandler),

  // POST /api/v1/targets (relative)
  http.post(`${API_BASE}/targets`, createTargetHandler),
  // POST /api/v1/targets (full URL)
  http.post(`${API_BASE_FULL}/targets`, createTargetHandler),

  // PUT /api/v1/targets/:id (relative)
  http.put(`${API_BASE}/targets/:id`, updateTargetHandler),
  // PUT /api/v1/targets/:id (full URL)
  http.put(`${API_BASE_FULL}/targets/:id`, updateTargetHandler),

  // DELETE /api/v1/targets/:id (relative)
  http.delete(`${API_BASE}/targets/:id`, deleteTargetHandler),
  // DELETE /api/v1/targets/:id (full URL)
  http.delete(`${API_BASE_FULL}/targets/:id`, deleteTargetHandler),
];

/**
 * Reset mock data (useful for tests)
 */
export function resetMockData(): void {
  mockTargets = Array.from({ length: 5 }, () => createRandomTarget());
}

/**
 * Get current mock targets (useful for tests)
 */
export function getMockTargets(): TargetDTO[] {
  return [...mockTargets];
}
