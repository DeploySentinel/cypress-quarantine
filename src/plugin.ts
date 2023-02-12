import styles from 'ansi-styles';

const log = (message: string) => {
  console.log(
    `${styles.yellow.open}${message}${styles.yellow.close}`,
  );
};

export default (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): [Cypress.PluginEvents, Cypress.PluginConfigOptions] => {
  const cypressVersion = config['version'];
  const envs = config['env'];

  on('before:run', (runDetails: Cypress.BeforeRunDetails) => {
    const { browser, group, parallel, system, tag, config } = runDetails;
  });

  on('task', {
    'debug': (msg: string) => {
      log(msg);
      return null;
    },
  });

  on('before:spec', (spec: Cypress.Spec) => {
  });

  on('after:spec', (spec: Cypress.Spec) => {
  });

  on(
    'after:run',
    async (
      runResults:
        | CypressCommandLine.CypressRunResult
        | CypressCommandLine.CypressFailedRunResult,
    ) => {
    },
  );

  return [on, config];
};
