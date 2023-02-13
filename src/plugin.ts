import crypto from 'crypto';

import isPlainObject from 'lodash/isPlainObject';
import get from 'lodash/get';
import styles from 'ansi-styles';
import { api } from '@deploysentinel/debugger-core';

type ExtraConfig = {
  apiUrl: string;
  meta?: Record<string, unknown>; // extra static data attached to payload
  // the response data has nested test cases
  // ex:
  // {
  //   descriptionA: {
  //      descriptionB: {
  //        testCase: true,
  //      }
  //   }
  // }
  nestedPaths?: boolean;
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
    if (isPlainObject(resp.data)) {
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
  const skippedTestCasesPerSpec = new Map<string, Record<string, any>>();

  log('Starting plugin...');

  on('task', {
    onSkip: async ({ path, titles }: { path: string; titles: string[] }) => {
      try {
        // pull from cache
        let skippedTestCases = skippedTestCasesPerSpec.get(path);
        if (!skippedTestCases) {
          log(`Fetching skipped tests for spec: ${path}`);
          skippedTestCases = await fetchSkippedTestCases(extraConfig.apiUrl, {
            path,
            titles,
            meta: {
              cypressVersion,
              ...extraConfig.meta,
            },
          });
          skippedTestCasesPerSpec.set(path, skippedTestCases as any);
        }
        if (isPlainObject(skippedTestCases)) {
          const shouldSkip = Boolean(get(skippedTestCases, titles));
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
