import { defineConfig } from 'cypress';
import plugin from './dist/plugin';

export default defineConfig({
  projectId: 'tacocat',
  env: {
    DEPLOYSENTINEL_KEY: '8549375e-20fb-4a5d-8871-cc0461a6c94c', // replace this with yours
    DEPLOYSENTINEL_UPLOAD_ON_PASSES: true,
    DEPLOYSENTINEL_LOG_VERBOSE: true,
    DEPLOYSENTINEL_API_URL: 'http://localhost:8000/ci',
  },
  e2e: {
    setupNodeEvents(on, config) {
      plugin(on, config, {
        apiUrl: 'http://localhost:8000/ci/quarantine-tests',
        meta: {
          testFramework: 'cypress',
        },
        getTestName: (titles: string[]) => titles.join(' '),
      });
      return config;
    },
  },
});
