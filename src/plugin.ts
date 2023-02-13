import crypto from 'crypto';

import styles from 'ansi-styles';
import { api, utils } from '@deploysentinel/debugger-core';

type ExtraConfig = {
  apiUrl: string;
  meta: Record<string, unknown>; // extra static data attached to payload
};

const log = (message: string) =>
  console.log(`${styles.yellow.open}${message}${styles.yellow.close}`);

const error = (message: any) =>
  console.log(`${styles.red.open}${message}${styles.red.close}`);

export const fetchSkippedTestCases = async (
  url: string,
  payload: {
    path: string;
    titles: string[];
    meta: Record<string, any>;
  },
  topLevelKey?: string,
) => {
  try {
    const axiosInstance = api.buildAxiosInstance({
      timeout: 60000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    const resp: any = await axiosInstance.post(url, payload);
    if (utils.validators.isObject(resp.data)) {
      return topLevelKey ? resp.data[topLevelKey] : resp.data;
    }
    return null;
  } catch (e) {
    error(e);
    return null;
  }
};

export const sha1 = (value: string) =>
  crypto.createHash('sha1').update(value).digest('hex');

export const getTestId = (path: string, titles: string[]) =>
  sha1(
    JSON.stringify({
      path,
      titles,
    }),
  );

export default (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
  extraConfig: ExtraConfig,
): [Cypress.PluginEvents, Cypress.PluginConfigOptions] => {
  const cypressVersion = config['version'];
  const envs = config['env'];

  log('Starting plugin...');

  on('task', {
    onSkip: async ({ path, titles }: { path: string; titles: string[] }) => {
      log(`Getting test id for ${path} > ${titles.join('-')}`);
      try {
        const skippedTestCases = await fetchSkippedTestCases(
          extraConfig.apiUrl,
          {
            path,
            titles,
            meta: {
              cypressVersion,
              ...extraConfig.meta,
            },
          },
        );
      } catch (e) {
        error(e);
      }
      return null;
    },
  });

  on(
    'after:run',
    async (
      runResults:
        | CypressCommandLine.CypressRunResult
        | CypressCommandLine.CypressFailedRunResult,
    ) => {},
  );

  return [on, config];
};
