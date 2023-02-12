it('does a search', () => {
  // Load "https://app.logdna.com/account/signin"
  cy.visit('https://app.logdna.com/account/signin');

  // cy.viewport(1280, 720);

  // Click on <input> [data-testid="email"]
  cy.get('[data-testid="email"]').click();

  // Fill "hi@michaelshi.m... on <input> [data-testid="email"]
  cy.get('[data-testid="email"]').type('hi@michaelshi.me');

  // Click on <input> [data-testid="password"]
  cy.get('[data-testid="password"]').click();

  // Fill "Q@qtkic!7ok4" on <input> [data-testid="password"]
  cy.get('[data-testid="password"]').type('Q@qtkic!7ok4');

  cy.intercept('/logs/lines?type=reset_canvas').as('logs');

  // Click on <button> "Sign in"
  cy.get('[data-testid="sign-in"]').click();

  // cy.wait("@logs");

  // Click on <a> "Everything"
  cy.get('[data-id="everything-link"]').click();

  // Click on <input> [data-testid="search-q"]
  cy.get('[data-testid="search-q"]').click();

  // Fill "error" on <input> [data-testid="search-q"]
  cy.get('[data-testid="search-q"]').type('error');

  // Press Enter on input
  cy.get('[data-testid="search-q"]').type('{Enter}');

  // Press Enter on input
  cy.get('#idontexisthere').click();
});
