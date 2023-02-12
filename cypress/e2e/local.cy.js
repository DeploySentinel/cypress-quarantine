// This spec file makes sure that tests that don't load a new page between tests still work properly
before(() => {
  cy.visit('http://localhost:8080/');
});

it('goes to getting started', () => {
  // Click on <a> "Docs"
  cy.get('[href="/docs/getting-started"]').click();
});

it('goes to login', () => {
  // Click on <a> "Docs"
  cy.get('[href="/login"]').click();
});
