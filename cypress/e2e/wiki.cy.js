describe('describe A', () => {
  it('visits a website (should be skipped)', () => {
    cy.visit('https://www.wikipedia.org');
    // Click on <input> #searchInput
    cy.get('#searchInput').click();

    // Fill "milk tea" on <input> #searchInput
    cy.get('#searchInput').type('milk tea');

    // Press Enter on input
    cy.get('#searchInput').type('{Enter}');

    cy.get('#firstHeading').should('include.text', 'Milk tea');

    cy.get('[href="/wiki/Tea"]').click();
  });

  it('visits a website (should pass)', () => {
    cy.visit('https://www.wikipedia.org');
    // Click on <input> #searchInput
    cy.get('#searchInput').click();

    // Fill "milk tea" on <input> #searchInput
    cy.get('#searchInput').type('milk tea');

    // Press Enter on input
    cy.get('#searchInput').type('{Enter}');

    cy.get('#firstHeading').should('include.text', 'Milk tea');

    cy.get('[href="/wiki/Milk"]').click();
  });
});
