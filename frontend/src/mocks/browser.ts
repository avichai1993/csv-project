/**
 * MSW Browser Setup
 *
 * Configures the service worker for browser-based mocking.
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
