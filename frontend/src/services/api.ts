/**
 * API Service
 *
 * Exports configured instances of generated OpenAPI clients.
 * All API paths and types come from the generated code.
 * MSW intercepts these calls transparently when mocking is enabled.
 */

import axios, { AxiosError } from 'axios';
import { Configuration, TargetsApi, HealthApi } from '../generated/api';

// API base URL from environment (without /api/v1 - it's included in generated paths)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  statusText: string;
  details?: unknown;

  constructor(message: string, status: number, statusText: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.details = details;
  }
}

// Parse error from various sources
export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status || 0;
    const statusText = error.response?.statusText || 'Network Error';
    const message = error.response?.data?.error 
      || error.response?.data?.message 
      || error.message 
      || 'An unexpected error occurred';
    const details = error.response?.data;
    
    return new ApiError(message, status, statusText, details);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0, 'Error', undefined);
  }

  return new ApiError('An unexpected error occurred', 0, 'Unknown Error', error);
}

// Get user-friendly error message
export function getErrorMessage(error: unknown): string {
  const apiError = parseApiError(error);
  
  if (apiError.status === 0) {
    return 'Unable to connect to the server. Please check your internet connection or try again later.';
  }
  if (apiError.status === 404) {
    return 'The requested resource was not found.';
  }
  if (apiError.status === 400) {
    return apiError.message || 'Invalid request. Please check your input.';
  }
  if (apiError.status === 500) {
    return 'Server error. Please try again later.';
  }
  if (apiError.status >= 500) {
    return 'The server is experiencing issues. Please try again later.';
  }
  
  return apiError.message;
}

// Axios instance with default config
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for request ID tracing
axiosInstance.interceptors.request.use((config) => {
  // Generate unique request ID if not present
  if (!config.headers['X-Request-ID']) {
    // Use crypto.randomUUID if available, fallback to timestamp-based ID
    try {
      config.headers['X-Request-ID'] = crypto.randomUUID();
    } catch {
      config.headers['X-Request-ID'] = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  return config;
});

// Add response interceptor for error logging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// OpenAPI configuration
const apiConfig = new Configuration({
  basePath: API_BASE_URL,
});

// Export configured API instances
export const targetsApi = new TargetsApi(apiConfig, API_BASE_URL, axiosInstance);
export const healthApi = new HealthApi(apiConfig, API_BASE_URL, axiosInstance);

// Re-export types from generated code for convenience
export type { TargetDTO, TargetCreateDTO, TargetUpdateDTO } from '../generated/api';
