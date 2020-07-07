# JavaScript REST client and utils for Clever Cloud's API 

## What is this?

This project contains a REST client for Clever Cloud's API and some utils.

## How do I use this?

First, you need to install the Node.js module:

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

Those helpers are ready to use for browsers or Node.js and for oAuth v1 signature auth.
The recommended way is to wrap those helpers in one place of your app and to reuse it everywhere you need to send API calls.

### In a browser based project?

Here's an example for a browser based project using ECMAScript modules with oAuth v1 signature and using the `fetch` API to send requests.

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

Then, in any file of your app, import the API function you need directly (it helps with tree shaking), call it and add a `.then(sendToApi)` like this:

```js
import { getAllEnvVars } from '@clevercloud/client/esm/api/application.js';
import { sendToApi } from '../send-to-api.js';

const envVars = await getAllEnvVars({ id: oid, appId }).then(sendToApi);
```

NOTE: It returns a promise, you may want to use `await` with it.

### In a Node.js based project?

Here's an example for a Node.js based project using CommonJS modules with oAuth v1 signature and using the `superagent` module to send requests.

In a file, expose this function:

```js
const { addOauthHeader } = require('@clevercloud/client/cjs/oauth.node.js');
const { prefixUrl } = require('@clevercloud/client/cjs/prefix-url.js');
const { request } = require('@clevercloud/client/cjs/request.superagent.js');

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

NOTE: If your project relies on a specific REST library (axios, request...), you'll have to write your own request function to plug the params to your lib instead of using `request.superagent.js`.

Then, in any file of your app, require the service, call the function on it and add a `.then(sendToApi)` like this:

```js
const application = require('@clevercloud/client/cjs/api/application.js');
const { sendToApi } = require('../send-to-api.js');

const envVars = await application.getAllEnvVars({ id: oid, appId }).then(sendToApi);
```

NOTE: It returns a promise, you may want to use `await` with it.

## How can I get the OAuth configuration ?

A general documentation is proposed on [our Website](https://www.clever-cloud.com/doc/clever-cloud-apis/cc-api/). As stated in the documentation :

> You need to create an oauth consumer token in the Clever Cloud console. A link "Create an oauth consumer" is available under your organization's addons list. All created consumers will appear below that link, like your applications and addons.

Once you got the consumer, you still need to generate the OAuth tokens. You may do the whole OAuth dance in the browser.

If you use the [clever-tools](https://github.com/CleverCloud/clever-tools) CLI, you can also generate tokens using the following command :

    clever login

Once successfully logged in, you’ll be provided with a token / secret couple.

## How can I generate a REST client from the API?

To generate a REST client from the API, run this command:

```sh
npm run generate-client
```

This command will:

1. Clean the cache and make sure the generated code comes from the latest Open API document
1. Generate the ESM version of the client
1. Generate the CJS version of the client for Node.js (based on ESM code)

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

## How can I generate a REST client for Node.js (CommonJS modules) from the API?

To generate a REST client for Node.js (CommonJS modules) from the API, run this command:

```sh
npm run generate-cjs-modules
```

NOTE: This is based on the ECMAScript modules in `esm`. Be sure to generate the ESM client before running this.

## What about streams?

This project exposes two "stream" APIs:

* Stream of logs via SSE, Server Sent Events (also called `EventSource`)
* Stream of events via WebSocket

Those streams are exposed with [`component-emitter`](https://www.npmjs.com/package/component-emitter), a tiny lib implementing an API that closely match both [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) from the DOM and [`EventEmitter`](https://nodejs.org/api/events.html) from Node.js. 

### Retrieving logs from Clever Cloud

Here's an example of how to use `LogsStream` to retrieve live logs from an app:

```js
// Browser implementation or Node.js implementation
import { LogsStream } from '@clevercloud/client/esm/streams/logs.browser.js';
// import { LogsStream } from '@clevercloud/client/esm/streams/logs.node.js';

// Load and cache config and tokens
const API_HOST = 'https://api.clever-cloud.com/v2';
const tokens = {
  OAUTH_CONSUMER_KEY: 'your OAUTH_CONSUMER_KEY',
  OAUTH_CONSUMER_SECRET: 'your OAUTH_CONSUMER_SECRET',
  API_OAUTH_TOKEN: 'your API_OAUTH_TOKEN',
  API_OAUTH_TOKEN_SECRET: 'your API_OAUTH_TOKEN_SECRET',
};

// Create a LogsStream instance (filter and deploymentId are optional)
const logsStream = new LogsStream({ apiHost: API_HOST, tokens, appId, filter, deploymentId });

// Listen to "log" events
logsStream.on('log', (rawLogLine) => console.log(rawLogLine));

// Open the stream
logsStream.open();
```

### Retrieving events from Clever Cloud

Here's an example of how to use `EventsStream` to retrieve events from the Clever Cloud platform:

```js
// Browser implementation or Node.js implementation
import { EventsStream } from '@clevercloud/client/esm/streams/events.browser.js';
// import { EventsStream } from '@clevercloud/client/esm/streams/events.node.js';

// Load and cache config and tokens
const API_HOST = 'https://api.clever-cloud.com/v2';
const tokens = {
  OAUTH_CONSUMER_KEY: 'your OAUTH_CONSUMER_KEY',
  OAUTH_CONSUMER_SECRET: 'your OAUTH_CONSUMER_SECRET',
  API_OAUTH_TOKEN: 'your API_OAUTH_TOKEN',
  API_OAUTH_TOKEN_SECRET: 'your API_OAUTH_TOKEN_SECRET',
};

// Create an EventsStream instance (appId is optional)
const eventsStream = new EventsStream({ apiHost: API_HOST, tokens, appId });

// Listen to "event" events
eventsStream.on('event', (rawEvent) => console.log(rawEvent));

// Open the stream
eventsStream.open();
```

### Handling errors

When an error (network failures, bad authentication...) occurs with the source stream, an error event is emitted:

```js
stream.on('error', (error) => console.error(error));
```

* By default, when a network failure is detected, an error is emitted and the stream is closed automatically.
* If you enable the auto retry behaviour, when a network failure is detected, it won't emit an error.
* If you enable the auto retry behaviour AND set a max number of retries, it will emit an error.

See "auto retry behaviour" section for more details...

### Close the stream

You can close the stream at any time like this:

```js
stream.close();
```

It won't remove event listeners from the stream instance so you can re-open it easily.

### Auto retry behaviour

When you call `.open()` on a stream, it's not resilient to network failures by default.
We have an opt-in auto retry behaviour to handle those, you can enable it when you open the stream like this:

```js
stream.open({ autoRetry: true });
```

Network failure are detected with a ping/pong system.
When such a failure is detected and auto retry behaviour is enabled, the source stream is closed and a new open is attempted automatically.

You probably don't need to but you can listen to events related to this auto retry behaviour:

```js
// "close" event is emitted each time a network failure is detected (or any unknown error not related to authentication)
stream.on('close', (reason) => console.log('Stream closed because of', reason));
// "open" event is emitted on first .open() call and each time a new open is attempted  
stream.on('open', () => console.log('Stream open...'));
// "ping" event is emitted each time a ping is received from the source stream  
stream.on('ping', () => console.log('Received ping'));
```

When enabled, the auto retry behaviour will follow an infinite exponential backoff pattern.
You can change the default timings and max number of retries like this:

```js
stream.open({
  autoRetry: true,
  // Factor used to compute exponential backoff delays, defaults to 1.25
  backoffFactor: 1.5,
  // First iteration timeout in ms, also used to compute exponential backoff delays, defaults to 1500
  initRetryTimeout: 2000,
  // Maximum number of consecutive iterations the auto retry behaviour can do, defaults to Infinity
  maxRetryCount: 6,
});
```
