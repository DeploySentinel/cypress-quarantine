# DeploySentinel Cypress Quarantine

Cypress plugin that helps devs to quarantine tests dynamically

## Installation

Install the Playwright reporter into your Playwright project.

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

```js
import { defineConfig } from 'cypress';
import cyQuarantine from '@deploysentinel/cypress-quarantine/plugin';

export default defineConfig({
  ...
  e2e: {
    setupNodeEvents(on, config) {
      cyQuarantine(on, config, {
        // api that tells which tests to skip per spec file
        apiUrl: 'http://localhost:8000/ci/quarantine-tests',
        meta: {
          testFramework: 'cypress',
          // or any custom static metadata
        },
        // specify how to generate unique test id based on titles
        // ex: titles: ['describe A', 'test case B'] -> 'describe A > test case B' (stored in db)
        // default to only test case name
        getTestId: (titles: string[]) => titles.join('>'),
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
The plugin has the ability to create a distinctive test ID through the use of `getTestId`,
which is derived from the hierarchical titles of nested tests.
In the API response, the test ID serves as the primary identifier that corresponds to a boolean value indicating 
whether the test case should be quarantined or not.

### Custom Metadata

The API request body includes a few default custom fields by default.
You can utilize this information to develop a test quarantine algorithm.

```
{
    cypressVesion: 'xxx',
    envs: {
        // test environment variables
    },
    commitInfo: {
        // git commit information
    },
}
```
