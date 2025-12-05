/**
 * API Service
 *
 * Exports configured instances of generated OpenAPI clients.
 * All API paths and types come from the generated code.
 * MSW intercepts these calls transparently when mocking is enabled.
 */

import axios from 'axios';
import { Configuration, TargetsApi, HealthApi } from '../generated/api';

// API base URL from environment (without /api/v1 - it's included in generated paths)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Axios instance with default config
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for request ID tracing
axiosInstance.interceptors.request.use((config) => {
  // Generate unique request ID if not present
  if (!config.headers['X-Request-ID']) {
    config.headers['X-Request-ID'] = crypto.randomUUID();
  }
  return config;
});

// OpenAPI configuration
const apiConfig = new Configuration({
  basePath: API_BASE_URL,
});

// Export configured API instances
export const targetsApi = new TargetsApi(apiConfig, API_BASE_URL, axiosInstance);
export const healthApi = new HealthApi(apiConfig, API_BASE_URL, axiosInstance);

// Re-export types from generated code for convenience
export type { TargetDTO, TargetCreateDTO, TargetUpdateDTO } from '../generated/api';
