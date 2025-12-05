// Cypress E2E support file
// Add custom commands and global configuration here

// Import commands
import './commands';

// Disable uncaught exception handling to prevent test failures from app errors
Cypress.on('uncaught:exception', () => {
  // Return false to prevent Cypress from failing the test
  return false;
});
