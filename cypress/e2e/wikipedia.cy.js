before(() => {
  cy.log('Before all hook in test');
  cy.visit('https://www.wikipedia.org');
});

beforeEach(() => {
  cy.log('Before each hook in test');
});

afterEach(() => {
  cy.log('After each hook in test');
});

after(() => {
  cy.log('After all hook in test');
});

it('Searches Wikipedia for Milk Tea', () => {
  // Click on <input> #searchInput
  cy.get('#searchInput').click();

  // Fill "milk tea" on <input> #searchInput
  cy.get('#searchInput').type('milk tea');

  // Press Enter on input
  cy.get('#searchInput').type('{Enter}');

  cy.get('#firstHeading').should('include.text', 'Milk tea');

  // Click on <a> "tea"
  cy.get('[href="/wiki/Tea"]').click();
});
