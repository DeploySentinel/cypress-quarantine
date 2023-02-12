// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import '../../dist/support';
import './commands';

before(() => {
  cy.log('Before all hook in e2e.js');
});

beforeEach(() => {
  cy.log('Before each hook in e2e.js');
});

afterEach(() => {
  cy.log('After each hook in e2e.js');
});

after(() => {
  cy.log('After all hook in e2e.js');
});
