# DeploySentinel Cypress Quarantine

Cypress plugin that helps devs to quarantine tests dynamically

## Installation

Install the Cypress plugin into your Cypress project.

```sh
npm install -D @deploysentinel/cypress-quarantine
```

## Usage

### Add Support File

In your Cypress project's **support** file (ex. `cypress/support/index.js`) add:

```js
// ❗ Must be declared at the top of the file ❗
import "@deploysentinel/cypress-quarantine/support";

...
import "./commands";
```

### Add Plugin

In your Cypress project's **plugin** file (ex. `cypress.config.ts`) add:

```ts
import { defineConfig } from 'cypress';
import cyQuarantine from '@deploysentinel/cypress-quarantine/plugin';

export default defineConfig({
  ...
  e2e: {
    setupNodeEvents(on, config) {
      cyQuarantine(on, config, {
        // api that tells which tests to skip per spec file (required)
        apiUrl: 'http://localhost:8000/ci/quarantine-tests',
        meta: {
          testFramework: 'cypress',
          // or any custom static metadata (optional)
        },
        // specify the method that generates unique test id based on nested test block titles (optional)
        getTestId: (titles: string[]) => titles.join(' > '),
        topLevelKey: 'xxx', // (optional)
      });
      return config;
    },
  },
});
```

## How Does it Work ?

When you use the plugin, it will make an `POST` API request to your server to retrieve quarantined tests for a specific file.
The resulting API response should look like
```
{
    'describe A > test case B': true,
    'describe A > test case C': false,
    ...
}
```
The key is a unique test ID derived from `getTestId`.
And the value indicates whether the test case should be quarantined or not.

### Custom Metadata

The API request body includes a few default custom fields by default.
You can utilize this information to develop a test quarantine algorithm.

```ts
{
    cypressVesion: string;
    // test environment variables
    envs: Record<string, string>;
    // git information
    commitInfo: {
      authorEmail: string | null;
      authorName: string | null;
      branch: string | null;
      defaultBranch: string | null;
      message: string | null;
      remoteBranch: string | null;
      remoteOrigin: string | null;
      sha: string | null;
      timestamp: number | null;
      metadata: unknown | null;
    },
}
```
