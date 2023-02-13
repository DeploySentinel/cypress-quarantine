before(() => {
  Cypress.config('baseUrl', 'https://httpstat.us');
});

describe('describe', () => {
  it('visits a website', () => {
    cy.visit('/');
  });

  it('visits a website 2', () => {
    cy.visit('/');
  });
});
