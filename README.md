# JavaScript REST client and utils for Clever Cloud's API 

## What is this?

This project contains a REST client for Clever Cloud's API and some utils.

## How do I use this?

First, you need to install the node module:

```sh
npm install @clevercloud/client
```
 
All API REST paths are accessible as "functions" organized in "services".
A call to a function of a service will just prepare the HTTP request and return the request params in an object via a promise.
It won't authenticate the request and it won't send it.

You will need to chain some helpers to the function call to:

* Specify the API host (prod, preprod...)
* Add the right authentication headers (oAuth v1 or other...)
* Send the HTTP request with your favourite lib/code
* Handle the response with your favourite lib/code

Those helpers are ready to use for browsers or node and for oAuth v1 signature auth.
The recommanded way is to wrap those helpers in one place of your app and to reuse it everywhere you need to send API calls.

### In a browser based project?

Here's a example for a browser based project using ECMAScript modules with oAuth v1 signature and using the `fetch` API to send requests.

In a file, expose this function:

```js
import { addOauthHeader } from '@clevercloud/client/esm/oauth.browser.js';
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';

export function sendToApi (requestParams) {

  // load and cache config and tokens
  const API_HOST = 'https://api.clever-cloud.com/v2'
  const tokens = {
    OAUTH_CONSUMER_KEY: 'your OAUTH_CONSUMER_KEY',
    OAUTH_CONSUMER_SECRET: 'your OAUTH_CONSUMER_SECRET',
    API_OAUTH_TOKEN: 'your API_OAUTH_TOKEN',
    API_OAUTH_TOKEN_SECRET: 'your API_OAUTH_TOKEN_SECRET',
  }

  return Promise.resolve(requestParams)
    .then(prefixUrl(API_HOST))
    .then(addOauthHeader(tokens))
    .then(request);
    // chain a .catch() call here if you need to handle some errors or maybe redirect to login
}
```

NOTE: If your project relies on a specific REST library (axios, jQuery...), you'll have to write your own request function to plug the params to your lib instead of using `request.fetch.js`.

Then in any file of your app, import the function you need directly (it helps with tree shaking), call it and add a `.then(sendToApi)` like this:

```js
import { getAllEnvVars } from '@clevercloud/client/esm/api/application.js';
import { sendToApi } from '../send-to-api.js';

const envVars = await getAllEnvVars({ id: oid, appId }).then(sendToApi);
```

NOTE: It returns a promise, you may want to use `await` with it.

### In a node based project?

Here's a example for a node based project using CommonJS modules with oAuth v1 signature and using the `request` module to send requests.

In a file, expose this function:

```js
const { addOauthHeader } = require('@clevercloud/client/cjs/oauth.node.js');
const { prefixUrl } = require('@clevercloud/client/cjs/prefix-url.js');
const { request } = require('@clevercloud/client/cjs/request.request.js');

module.exports.sendToApi = function sendToApi (requestParams) {

  // load and cache config and tokens
  const API_HOST = 'https://api.clever-cloud.com/v2'
  const tokens = {
    OAUTH_CONSUMER_KEY: 'your OAUTH_CONSUMER_KEY',
    OAUTH_CONSUMER_SECRET: 'your OAUTH_CONSUMER_SECRET',
    API_OAUTH_TOKEN: 'your API_OAUTH_TOKEN',
    API_OAUTH_TOKEN_SECRET: 'your API_OAUTH_TOKEN_SECRET',
  }

  return Promise.resolve(requestParams)
    .then(prefixUrl(API_HOST))
    .then(addOauthHeader(tokens))
    .then(request);
    // chain a .catch() call here if you need to handle some errors or maybe redirect to login
}
```

NOTE: If your project relies on a specific REST library (axios, superagent...), you'll have to write your own request function to plug the params to your lib instead of using `request.request.js`.

Then in any file of your app, require the service, call the function on it and add a `.then(sendToApi)` like this:

```js
const application = require('@clevercloud/client/cjs/api/application.js');
const { sendToApi } = require('../send-to-api.js');

const envVars = await application.getAllEnvVars({ id: oid, appId }).then(sendToApi);
```

NOTE: It returns a promise, you may want to use `await` with it.

## How can I generate a REST client from the API?

To generate a REST client from the API, run this command:

```sh
npm run generate-client
```

This command will:

1. Clean the cache and make sure that the generated code comes from the latest Open API document
1. Generate the ESM version of the client
1. Generate the CJS version of the client for node (based on ESM code)

## How can I generate a REST client (ECMAScript modules) from the API?

To generate a REST client (ECMAScript modules) from the API, run this command:

```sh
npm run generate-client-from-openapi
```

This command will do the following steps:

1. Fetch the Clever Cloud Open API document (prod, see below for preprod)
1. Patch the document with `.cache/openapi-clever.patched.json` (this step should disappear one day)
1. Extract all routes from patched document
1. Merge similar routes (`/self` and `/organisatio/{id}`)
1. Generate  client code (ES6 modules, tree-shakabled, annotated with JSDoc...)
1. Clear destination path `esm/api`
1. Write code in appropriate files (grouped by service) 
1. Generate legacy client (which uses new generated client)
1. Write code for legacy client in `esm/api/legacy-client.js` 

NOTE: The first step caches the Open API document locally for next calls, be sure to run this command to clear the content of `.cache` if you want a clean build:

```sh
npm run clean-cache
```

If you want to generate a client for the preprod, you can change the config of `OPEN_API_URL` in `tasks/config.js`.

## How can I generate a REST client for node (CommonJS modules) from the API?

To generate a REST client for node (CommonJS modules) from the API, run this command:

```sh
npm run generate-cjs-modules
```

NOTE: This is based on the ECMAScript modules in `esm`. Be sure to generate the ESM client before running this.
