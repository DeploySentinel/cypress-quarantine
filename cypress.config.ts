import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'tacocat',
  env: {
    DEPLOYSENTINEL_KEY: '8549375e-20fb-4a5d-8871-cc0461a6c94c', // replace this with yours
    DEPLOYSENTINEL_UPLOAD_ON_PASSES: true,
    DEPLOYSENTINEL_LOG_VERBOSE: true,
    DEPLOYSENTINEL_API_URL: 'http://localhost:8000/ci',
  },
  e2e: {
    setupNodeEvents(_on, _config) {
      const [on, config] = require('./dist/plugin')(_on, _config, {
        beforeNetworkSend: event => {
          if (event.url.includes('/me')) {
            return null;
          }
          if (event.url.includes('cdn.jsdelivr.net')) {
            return null;
          }
          return event;
        },
      });

      on('before:browser:launch', (browser, launchOptions) => {
        //  Open dev tools in Chrome by default
        if (browser.name === 'chrome' || browser.name === 'chromium') {
          launchOptions.args.push('--auto-open-devtools-for-tabs');
        }

        // Start browsers with prefers-reduced-motion set to "reduce"
        if (browser.family === 'firefox') {
          launchOptions.preferences['ui.prefersReducedMotion'] = 1;
        }

        if (browser.family === 'chromium') {
          launchOptions.args.push('--force-prefers-reduced-motion');
        }

        return launchOptions;
      });

      return config;
    },
  },
});
