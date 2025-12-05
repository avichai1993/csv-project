/**
 * Main Application Component
 *
 * Sets up React Router and wraps the app in ErrorBoundary.
 */

import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import router from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
