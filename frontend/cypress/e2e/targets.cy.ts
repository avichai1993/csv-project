describe('Target Management', () => {
  beforeEach(() => {
    cy.visit('/targets');
    // Wait for the page to load and data to be fetched
    cy.contains('h1', 'Targets', { timeout: 10000 }).should('be.visible');
  });

  describe('Target List', () => {
    it('displays the targets page', () => {
      cy.contains('h1', 'Targets').should('be.visible');
      cy.contains('button', 'Add Target').should('be.visible');
    });

    it('shows target table with headers', () => {
      // Wait for table to appear (either with data or loading to finish)
      cy.get('table', { timeout: 10000 }).should('be.visible');
      cy.contains('th', 'ID').should('be.visible');
      cy.contains('th', 'Coordinates').should('be.visible');
      cy.contains('th', 'Frequency').should('be.visible');
      cy.contains('th', 'IP Address').should('be.visible');
    });

    it('displays mock targets in the table', () => {
      // Wait for table rows to appear
      cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
    });
  });

  describe('Add Target', () => {
    it('opens add target modal', () => {
      cy.contains('button', 'Add Target').click();
      cy.contains('Add New Target').should('be.visible');
    });

    it('can fill and submit the form', () => {
      cy.contains('button', 'Add Target').click();
      cy.contains('Add New Target').should('be.visible');
      
      // Fill form fields
      cy.get('input[name="latitude"]').clear().type('45.5');
      cy.get('input[name="longitude"]').clear().type('-122.6');
      cy.get('input[name="altitude"]').clear().type('100');
      cy.get('input[name="frequency"]').clear().type('915');
      cy.get('input[name="speed"]').clear().type('25');
      cy.get('input[name="bearing"]').clear().type('180');
      cy.get('input[name="ip_address"]').clear().type('10.0.0.1');
      
      // Submit
      cy.contains('button', 'Create Target').click();
      
      // Modal should close (wait for it)
      cy.contains('Add New Target', { timeout: 10000 }).should('not.exist');
      
      // New target should appear in table
      cy.contains('10.0.0.1', { timeout: 10000 }).should('be.visible');
    });

    it('shows validation errors for invalid input', () => {
      cy.contains('button', 'Add Target').click();
      cy.contains('Add New Target').should('be.visible');
      
      // Try to submit empty form
      cy.contains('button', 'Create Target').click();
      
      // Should show validation errors
      cy.contains('Must be between -90 and 90').should('be.visible');
    });
  });

  describe('Edit Target', () => {
    beforeEach(() => {
      // Ensure table has loaded with data before edit tests
      cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
    });

    it('opens edit modal when clicking edit button', () => {
      // Click first edit button
      cy.get('button[title="Edit target"]').first().click();
      
      // Should show edit modal
      cy.contains('Edit Target').should('be.visible');
    });

    it('can edit and save a target', () => {
      cy.get('button[title="Edit target"]').first().click();
      cy.contains('Edit Target').should('be.visible');
      
      // Clear and update IP address
      cy.get('input[name="ip_address"]').clear().type('10.10.10.10');
      
      // Save
      cy.contains('button', 'Save Changes').click();
      
      // Modal should close and new IP should be visible
      cy.contains('Edit Target', { timeout: 10000 }).should('not.exist');
      cy.contains('10.10.10.10', { timeout: 10000 }).should('be.visible');
    });
  });

  describe('Delete Target', () => {
    beforeEach(() => {
      // Ensure table has loaded with data before delete tests
      cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
    });

    it('opens delete confirmation modal', () => {
      cy.get('button[title="Delete target"]').first().click();
      cy.contains('Confirm Delete').should('be.visible');
    });

    it('can cancel deletion', () => {
      cy.get('table tbody tr').then(($rows) => {
        const initialCount = $rows.length;
        
        cy.get('button[title="Delete target"]').first().click();
        cy.contains('Confirm Delete').should('be.visible');
        cy.contains('button', 'Cancel').click();
        
        // Modal should close
        cy.contains('Confirm Delete', { timeout: 5000 }).should('not.exist');
        
        // Same number of rows
        cy.get('table tbody tr').should('have.length', initialCount);
      });
    });

    it('can delete a target', () => {
      // Get initial row count
      cy.get('table tbody tr').then(($rows) => {
        const initialCount = $rows.length;
        
        // Click delete on first row
        cy.get('button[title="Delete target"]').first().click();
        cy.contains('Confirm Delete').should('be.visible');
        cy.contains('button', 'Delete Target').click();
        
        // Should have one less row
        cy.get('table tbody tr', { timeout: 10000 }).should('have.length', initialCount - 1);
      });
    });
  });
});
