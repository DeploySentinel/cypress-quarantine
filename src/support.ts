// Global vars
const isOpenMode = Cypress.config('isInteractive');
const isComponentTest = Boolean(Cypress.config('devServer' as any));
const getFilePath = () => Cypress.spec.relative;

