// Cypress custom commands
// Add reusable commands here

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Wait for the app to be ready (MSW loaded, initial data fetched)
       */
      waitForApp(): Chainable<void>;
      
      /**
       * Wait for table data to load
       */
      waitForTableData(): Chainable<void>;
    }
  }
}

// Wait for app to be ready
Cypress.Commands.add('waitForApp', () => {
  // Wait for the page title to appear
  cy.contains('h1', 'Targets', { timeout: 15000 }).should('be.visible');
  // Wait for loading to finish (table or empty state)
  cy.get('table, .alert', { timeout: 15000 }).should('be.visible');
});

// Wait for table data to load
Cypress.Commands.add('waitForTableData', () => {
  // Wait for table rows to appear (MSW provides mock data)
  cy.get('table tbody tr', { timeout: 15000 }).should('have.length.at.least', 1);
});

export {};
