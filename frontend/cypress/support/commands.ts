// Cypress custom commands
// Add reusable commands here

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Wait for the app to be ready (MSW loaded, initial data fetched)
       */
      waitForApp(): Chainable<void>;
    }
  }
}

// Wait for app to be ready
Cypress.Commands.add('waitForApp', () => {
  // Wait for the targets table or empty state to appear
  cy.get('table, [class*="alert"]', { timeout: 10000 }).should('be.visible');
});

export {};
