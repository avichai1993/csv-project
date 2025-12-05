// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Enable MSW mocking in development when VITE_USE_MOCKS=true
 */
async function enableMocking(): Promise<void> {
  if (import.meta.env.VITE_USE_MOCKS !== 'true') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  
  // Start the service worker
  await worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
  });
  
  console.log('[MSW] Mock Service Worker enabled');
}

// Start app after mocking is ready
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    // StrictMode causes double renders/effects in dev - disabled for cleaner dev experience
    // Re-enable for catching bugs: <StrictMode><App /></StrictMode>
    <App />,
  );
});
