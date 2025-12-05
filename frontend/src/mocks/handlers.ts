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

const API_BASE = '/api/v1';

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

/**
 * MSW handlers for all API endpoints
 */
export const handlers = [
  // Health check
  http.get(`${API_BASE.replace('/v1', '')}/health`, () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  }),

  // GET /api/v1/targets - List all targets
  http.get(`${API_BASE}/targets`, () => {
    return HttpResponse.json(mockTargets);
  }),

  // GET /api/v1/targets/:id - Get single target
  http.get(`${API_BASE}/targets/:id`, ({ params }) => {
    const { id } = params;
    const target = mockTargets.find((t) => t.id === id);

    if (!target) {
      return HttpResponse.json(
        { error: 'Target not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return HttpResponse.json(target);
  }),

  // POST /api/v1/targets - Create new target
  http.post(`${API_BASE}/targets`, async ({ request }) => {
    const body = (await request.json()) as TargetCreateDTO;

    const newTarget: TargetDTO = {
      id: faker.string.uuid(),
      ...body,
    };

    mockTargets.push(newTarget);

    return HttpResponse.json(newTarget, { status: 201 });
  }),

  // PUT /api/v1/targets/:id - Update target
  http.put(`${API_BASE}/targets/:id`, async ({ params, request }) => {
    const { id } = params;
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
  }),

  // DELETE /api/v1/targets/:id - Delete target
  http.delete(`${API_BASE}/targets/:id`, ({ params }) => {
    const { id } = params;
    const index = mockTargets.findIndex((t) => t.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { error: 'Target not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    mockTargets.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
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
