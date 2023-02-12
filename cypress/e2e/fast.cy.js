before(() => {
  Cypress.config('baseUrl', 'https://httpstat.us');
});

it('visits a website', () => {
  cy.visit('/');
});
