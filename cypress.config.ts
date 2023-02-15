import { defineConfig } from 'cypress';
import plugin from './dist/plugin';

export default defineConfig({
  projectId: 'tacocat',
  e2e: {
    setupNodeEvents(on, config) {
      plugin(on, config, {
        apiUrl: 'http://localhost:3000/tests',
        meta: {
          testFramework: 'cypress',
        },
        getTestId: (titles: string[]) => titles.join(' '),
      });
      return config;
    },
  },
});
