import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry, {
  exponentialDelay,
  isNetworkError,
  isRetryableError,
} from 'axios-retry';
import { GitClient } from '@deploysentinel/debugger-core';
import isPlainObject from 'lodash/isPlainObject';
import lGet from 'lodash/get';
import styles from 'ansi-styles';

import { version as PKG_VERSION } from '../package.json';

// TODO: custom headers support ??
const buildAxiosInstance = (config: AxiosRequestConfig) => {
  // patch headers
  config.headers = {
    ...config.headers,
    'x-msw-bypass': 'true', // in case the client has msw enabled
  };
  const instance = axios.create(config);
  axiosRetry(instance, {
    retries: 3,
    retryDelay: exponentialDelay,
    retryCondition: error => {
      if (isNetworkError(error)) {
        return true;
      }
      if (!error.config) {
        // Cannot determine if the request can be retried
        return false;
      }
      return isRetryableError(error);
    },
  });
  return instance;
};

type ExtraConfig = {
  apiUrl: string;
  meta?: Record<string, unknown>; // extra static data attached to payload
  getTestId?: (titles: string[]) => string; // can specify the callback to build up unique test id
  topLevelKey?: string; // in case api response includes top level key
};

const log = (message: string) =>
  console.log(
    `${styles.yellow.open}[cypress-quarantine] ${message}${styles.yellow.close}`,
  );

const error = (message: any) =>
  console.log(
    `${styles.red.open}[cypress-quarantine] ${message}${styles.red.close}`,
  );

const axiosInstance = buildAxiosInstance({
  timeout: 60000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});
const fetchTestsToBeQuarantined = async (
  url: string,
  payload: {
    path: string;
    meta: Record<string, any>;
  },
  topLevelKey?: string,
) => {
  try {
    const resp: any = await axiosInstance.post(url, payload);
    if (isPlainObject(resp.data)) {
      return topLevelKey ? resp.data[topLevelKey] : resp.data;
    }
    return null;
  } catch (e) {
    error(e);
    return null;
  }
};

export default (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
  extraConfig: ExtraConfig,
): [Cypress.PluginEvents, Cypress.PluginConfigOptions] => {
  const cypressVersion = config['version'];
  const envs = config['env'];
  const testsToBeQuarantinedPerSpec = new Map<string, Record<string, boolean>>();
  const gitClient = new GitClient({
    // FIXME: this should be optional
    error,
  } as any);

  log(`Starting plugin [v${PKG_VERSION}]...`);

  on('task', {
    fetchTestsToBeQuarantined: async (path: string) => {
      try {
        const commitInfo = await gitClient.getCommitInfo();
        // pull from cache
        let tests = testsToBeQuarantinedPerSpec.get(path);
        if (!tests) {
          const ts = Date.now();
          log(`Fetching skipped tests for spec "${path}"`);
          tests = await fetchTestsToBeQuarantined(
            extraConfig.apiUrl,
            {
              path,
              meta: {
                envs,
                cypressVersion,
                commitInfo,
                ...extraConfig.meta,
              },
            },
            extraConfig.topLevelKey,
          );
          log(
            `Fetched skipped tests for spec "${path}" took ${
              Date.now() - ts
            } ms`,
          );
          testsToBeQuarantinedPerSpec.set(path, tests as any);
        }
      } catch (e) {
        error(e);
      }
      return null;
    },
    onSkip: ({ path, titles }: { path: string; titles: string[] }) => {
      try {
        const tests = testsToBeQuarantinedPerSpec.get(path);
        if (isPlainObject(tests)) {
          const shouldSkip = Boolean(
            lGet(
              tests,
              extraConfig.getTestId
                ? extraConfig.getTestId(titles)
                : titles[titles.length - 1],
            ),
          );
          if (shouldSkip) {
            log(`Quarantining test ${path} > ${titles.join(' ')}`);
          }
          return shouldSkip;
        }
      } catch (e) {
        error(e);
      }
      return null;
    },
  });

  return [on, config];
};
