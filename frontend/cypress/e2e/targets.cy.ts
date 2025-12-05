describe('Target Management', () => {
  beforeEach(() => {
    cy.visit('/targets');
    cy.waitForApp();
  });

  describe('Target List', () => {
    it('displays the targets page', () => {
      cy.contains('h1', 'Targets').should('be.visible');
      cy.contains('button', 'Add Target').should('be.visible');
    });

    it('shows target table with headers', () => {
      cy.get('table').should('be.visible');
      cy.contains('th', 'ID').should('be.visible');
      cy.contains('th', 'Coordinates').should('be.visible');
      cy.contains('th', 'Frequency').should('be.visible');
      cy.contains('th', 'IP Address').should('be.visible');
    });

    it('displays mock targets in the table', () => {
      // Should have at least one row of data
      cy.get('table tbody tr').should('have.length.at.least', 1);
    });
  });

  describe('Add Target', () => {
    it('opens add target modal', () => {
      cy.contains('button', 'Add Target').click();
      cy.contains('Add New Target').should('be.visible');
    });

    it('can fill and submit the form', () => {
      cy.contains('button', 'Add Target').click();
      
      // Fill form fields
      cy.get('input[name="latitude"]').type('45.5');
      cy.get('input[name="longitude"]').type('-122.6');
      cy.get('input[name="altitude"]').type('100');
      cy.get('input[name="frequency"]').type('915');
      cy.get('input[name="speed"]').type('25');
      cy.get('input[name="bearing"]').type('180');
      cy.get('input[name="ip_address"]').type('10.0.0.1');
      
      // Submit
      cy.contains('button', 'Create Target').click();
      
      // Modal should close
      cy.contains('Add New Target').should('not.exist');
      
      // New target should appear in table
      cy.contains('10.0.0.1').should('be.visible');
    });

    it('shows validation errors for invalid input', () => {
      cy.contains('button', 'Add Target').click();
      
      // Try to submit empty form
      cy.contains('button', 'Create Target').click();
      
      // Should show validation errors
      cy.contains('Must be between -90 and 90').should('be.visible');
    });
  });

  describe('Edit Target', () => {
    it('opens edit modal when clicking edit button', () => {
      // Click first edit button
      cy.get('button[title="Edit target"]').first().click();
      
      // Should show edit modal
      cy.contains('Edit Target').should('be.visible');
    });

    it('can edit and save a target', () => {
      cy.get('button[title="Edit target"]').first().click();
      
      // Clear and update IP address
      cy.get('input[name="ip_address"]').clear().type('10.10.10.10');
      
      // Save
      cy.contains('button', 'Save Changes').click();
      
      // Modal should close and new IP should be visible
      cy.contains('Edit Target').should('not.exist');
      cy.contains('10.10.10.10').should('be.visible');
    });
  });

  describe('Delete Target', () => {
    it('opens delete confirmation modal', () => {
      cy.get('button[title="Delete target"]').first().click();
      cy.contains('Confirm Delete').should('be.visible');
    });

    it('can cancel deletion', () => {
      const initialCount = Cypress.$('table tbody tr').length;
      
      cy.get('button[title="Delete target"]').first().click();
      cy.contains('button', 'Cancel').click();
      
      // Modal should close
      cy.contains('Confirm Delete').should('not.exist');
      
      // Same number of rows
      cy.get('table tbody tr').should('have.length', initialCount);
    });

    it('can delete a target', () => {
      // Get initial row count
      cy.get('table tbody tr').then(($rows) => {
        const initialCount = $rows.length;
        
        // Click delete on first row
        cy.get('button[title="Delete target"]').first().click();
        cy.contains('button', 'Delete Target').click();
        
        // Should have one less row
        cy.get('table tbody tr').should('have.length', initialCount - 1);
      });
    });
  });
});
