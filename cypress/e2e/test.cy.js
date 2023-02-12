describe('desc testing', () => {
  it('Visits the Profile Page after Logging In', () => {
    // Load "https://www.deploysentinel.com/"
    cy.visit('https://www.deploysentinel.com/');

    // Click on <a> "Login"
    cy.get('[href="/login"]').click();

    // Click on <input> #email
    cy.get('#email').click();

    // Fill "1231mike@gmail.... on <input> #email
    cy.get('#email').type('1231mike@gmail.com');

    // Click on <input> #password
    cy.get('#password').click();

    // Fill "D3p0yS3nt1nEl!" on <input> #password
    cy.get('#password').type('D3p0yS3nt1nEl!');

    // Click on <button> "Login via Email"
    cy.get('.text-center > .px-6').click();

    // Click on <a> "My Profile"
    cy.get('[href="/profile"]').click();
    cy.get('roooo').click();
  });

  it('Visits the Login Page', () => {
    cy.visit('https://app.alloy.ai/login');
    cy.get('foo');
  });
});

it('Tests Amazon Search with Prime', () => {
  // Load "https://www.amazon.com/"
  cy.visit('https://www.amazon.com/');

  // Click on <input> #twotabsearchtextbox
  cy.get('#twotabsearchtextbox').click();

  // Fill "testing" on <input> #twotabsearchtextbox
  cy.get('#twotabsearchtextbox').type('testing');

  // Press Enter on input
  cy.get('#twotabsearchtextbox').type('{Enter}');

  // Click on <div> "Amazon Prime"
  cy.get('#primeRefinements').click();

  // Click on <div> "Amazon Prime"
  cy.get('#failpls').click();
});
