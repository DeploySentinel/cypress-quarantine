it('Views CI Test Result Dashboard', () => {
  cy.on('uncaught:exception', err => {
    console.log(err);
    return false;
  });

  // Load "https://www.deploysentinel.com/"
  cy.visit('https://www.deploysentinel.com/');

  // Click on <a> "Login"
  cy.get('[href="/login"]').click();

  // Fill "1231mike@gmail.... on <input> #email
  cy.get('#email').type('1231mike@gmail.com');

  // Fill "D3p0yS3nt1nEl!" on <input> #password
  cy.get('#password').type('D3p0yS3nt1nEl!');

  // Click on <button> "Login via Email"
  cy.get('.text-center > .px-6').click();

  // Click on <a> "My Profile"
  cy.get('[href="/profile"]').click();

  cy.intercept('https://api.deploysentinel.com/ci/test-batches').as(
    'getTestBatches',
  );

  // Click on <a> "My Profile"
  cy.get('[href="/ci/dashboard"]').click();

  cy.wait('@getTestBatches');

  cy.get('.mt-4:nth-child(1) .accordion-button').click();

  cy.intercept('https://api.deploysentinel.com/runs/*').as('run');

  cy.get('.show .d-flex:nth-child(2) a').click();

  cy.wait('@run');
});
