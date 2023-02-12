const getTestTitles = (
  cypressTest: Mocha.Test | Mocha.Suite | undefined,
  titles: string[],
  currentDepth = 0,
): void => {
  if (!cypressTest?.title || currentDepth > 32) {
    return;
  }

  if (Array.isArray(titles)) {
    titles.unshift(cypressTest.title);
  }

  getTestTitles(cypressTest.parent, titles, currentDepth + 1);
};

// Global vars
// const isOpenMode = Cypress.config('isInteractive');
// const isComponentTest = Boolean(Cypress.config('devServer' as any));
const getFilePath = () => Cypress.spec.relative;

beforeEach(function () {
  const currentTest = this.currentTest;
  if (currentTest) {
    const titles: string[] = [];
    getTestTitles(currentTest, titles);
    cy.task('onSkip', { path: getFilePath(), titles }).then(shouldSkip => {
      if (shouldSkip) {
        const ctx = currentTest.ctx;
        ctx?.skip();
      }
      return null;
    });
  }
});
