# Clever Client changelog

## [11.1.1](https://github.com/CleverCloud/clever-client.js/compare/11.1.0...11.1.1) (2025-09-11)


### 🐛 Bug Fixes

* set required node version to `&gt;=22` ([4e8c395](https://github.com/CleverCloud/clever-client.js/commit/4e8c3955dc6a5c3c75bc2be63f9a10a408d377e5))

## [11.1.0](https://github.com/CleverCloud/clever-client.js/compare/11.0.1...11.1.0) (2025-09-10)


### 🚀 Features

* implement base client library ([46bde34](https://github.com/CleverCloud/clever-client.js/commit/46bde344e4d25094617834be871e145c2b06f60d))
* implement cc-api client ([dfb9d91](https://github.com/CleverCloud/clever-client.js/commit/dfb9d91c7ad1bbf39e2d19d916b3aa378cc9f96a))
* implement cc-api-bridge client ([7f6342d](https://github.com/CleverCloud/clever-client.js/commit/7f6342ddfc66922e4256d0a9911c2af5d35cddc0))
* implement redis-http client ([f83ebcf](https://github.com/CleverCloud/clever-client.js/commit/f83ebcfecb44f41f440c76cf5fc0e68b40d12c17))


### 🐛 Bug Fixes

* fix some types ([884a1e4](https://github.com/CleverCloud/clever-client.js/commit/884a1e4e31c77be032e89d5bc72f3432cf9ec2d8))
* **legacy:** make the id param optional when handling /self and /organisations/:XXX ([1734ef0](https://github.com/CleverCloud/clever-client.js/commit/1734ef0c263a742cfce656024bb4b138c196391f))

## [11.0.1](https://github.com/CleverCloud/clever-client.js/compare/11.0.0...11.0.1) (2025-06-30)


### 🐛 Bug Fixes

* fix plaintext OAuth for old logs and event API ([1c2c7d3](https://github.com/CleverCloud/clever-client.js/commit/1c2c7d3d004e78a6a1448aade1aec2f9b49b08bb))

## [11.0.0](https://github.com/CleverCloud/clever-client.js/compare/10.1.0...11.0.0) (2025-06-30)


### ⚠ BREAKING CHANGES

* this requires Node.js 21+ if you use the event API You also need to these imports:
    * `@clevercloud/client/esm/streams/events.browser.js`
    * `@clevercloud/client/esm/streams/events.node.js`
    to this:
    * `@clevercloud/client/esm/streams/events.js`

### 🚀 Features

* add API call analysis scripts ([49f01da](https://github.com/CleverCloud/clever-client.js/commit/49f01da276afd1494ee5e7402dc6f0c3550d451f))
* use OAuth plaintext instead of hmac512 and remove `oauth-1.0a` ([e2a6886](https://github.com/CleverCloud/clever-client.js/commit/e2a6886c3029a7536bda4af242e4cf484b926422))


### 🧹 Miscellaneous Chores

* replace `ws` with native WebSocket support for Node.js ([e8dbfe3](https://github.com/CleverCloud/clever-client.js/commit/e8dbfe3dbf3d1190fc74a4c14a9def00f023079c))

## 10.1.0 (2025-04-04)

* feat(zones): add ownerId query param (#141)
* fix: use correct query param name for fetchHeatmapPoints

## 10.0.0 (2025-03-25)

### ⚠ BREAKING CHANGES

* build: remove cjs client generation (#124)
* chore(legacy-client): remove legacy client (#125)
* chore(access-logs-metrics): remove useless functions

### Features

* logs: introduce new `ResourceLogStream` class for new SSE addon logs

### Refactor

* build: add prettier (#121)
* build: upgrade eslint (#122)
* build: add typechecking (#123)

## 9.2.1 (2025-03-04)

* fix: fix grafana management methods

## 9.2.0 (2025-02-26)

* feat: add `stats.fetchHeatmapPoints`
* feat: add `saas.resetGrafanaOrganisation`
* feat: add `saas.deleteGrafanaOrganisation`
* feat: add `saas.createGrafanaOrganisation`
* feat: add `saas.getGrafanaOrganisation`
* feat: add `billing.getPriceSystem`
* feat: add `instance.getAllApplicationInstances`
* feat: add `loadBalancers.getDefaultLoadBalancersDnsInfo`
* feat: add `saas.getHeptapodPricePrevision`
* feat: add `providers.getEsOptionsFlavors`
* feat: add `materia.getMateriaKvInfo`
* feat: add `billing.getOrganisationPriceSystem`
* feat: add `billing.getCreditsSummary`
* chore: include esm/api in sources
* refactor(diag-domain-config.types): remove `private` from `DiagSummary`

## 9.1.0 (2024-10-16)

* feat(esm/utils): add `diagDomainConfig`

## 9.0.0 (2024-09-11)

⚠ BREAKING CHANGES

* refactor(oauth): rely on global crypto instead of using a conditionnal `import('node:crypto')`

## 8.3.0 (2024-06-26)

* feat(streams): new accesslogs API
* feat(sse): flatten reason object and add a mandatory type

## 8.2.0 (2024-02-27)

* feat: allow error handling from legacy client
* feat: support repeatable query params
* fix(sse): fix OAuth signature when a query param is repeated

## 8.1.2 (2024-02-15)

* fix(stream): fix query params with ApplicationLogStream

## 8.1.1 (2024-02-13)

* fix(sse): use query parameters in OAuth signature

## 8.1.0 (2024-02-07)

* fix(stream): consider `ENOTFOUND` (macOS DNS error) as retryable for ApplicationLogStream
* feat(stream): make `retryCount` public on ApplicationLogStream
* fix(stream): prevent uncaught errors on retry with ApplicationLogStream (firefox)
* fix(stream): consider browser network errors as retryable
* feat(stream): add a `connectionTimeout` param on ApplicationLogStream (default: 5s)

## 8.0.3 (2024-01-30)

* chore: make the options param of the on method optional
* fix: always clear timeouts in `stream.abstract` close method (logs SSE and events WS)
* fix: various fixes on ApplicationLogStream (see https://github.com/CleverCloud/clever-client.js/pull/93)
  * introduce new errors `NetworkError`, `HttpError` with `status` property and `ServerError`
  * Clear heartbeat `setInterval` properly
  * Make sure `start.then()` resolves with a `reason` not being an `Error` object
  * Make sure `start.catch()` rejects with an `Error` object
  * Fix the `getBytes` bug
  * Fix the `last-event-id`
  * Remove the double retry caused by inner pause/resume
  * Fix lastContact when no logs are emitted
  * Mark some errors as retryable and some not

### For devs

* test: introduce a test suite for ApplicationLogStream

## 8.0.2 (2023-10-31)

* fix: abort controller behaviour with `sse-parse` used by `ApplicationLogsStream` (Node.js < 18.16)

## 8.0.1 (2023-10-17)

* adjust esm/cjs build to transform dynamic imports into Node.js compatible syntax

## 8.0.0 (2023-10-17)

### ⚠ BREAKING CHANGES

* Update project to Node.js 18.5
* Replace `oauth.browser.js` and `oauth.node.js` with one browser/Node.js compatible file: `oauth.js`
  * You may need to adjust your bundler's settings to assume `crypto` as a global
* Delete `request.superagent.js` and make `request.fetch.js` compatible with Node.js
* Move project from CJS to ESM
  * Files are is still distributed in `esm` and `cjs` directories
  * The `cjs` will be removed in a later major release
  * There are still some Node.js specific files we need to replace with browser/Node.js compatible versions

### Features

* Introduce new `ApplicationLogsStream` class for new SSE logs (v4)

## 7.11.0 (2023-01-09)

* Improve error handling on fetch request
* Generate-client:
  * Handle invalid `delete` function name
  * Handle `requestBody.content` when only described as a `$ref`

## 7.10.0 (2022-03-23)

* Add new utils `getOrgaPaymentMethodsError` and `getAllOrgaPaymentMethodsErrors`

## 7.9.0 (2022-02-24)

* Change OVD `openapi.json` URL

## 7.8.1 (2022-02-15)

* Rollback `cc-client-version` header for all calls

## 7.8.0 (2022-02-15)

* Add support for remote OVD OpenAPI
* Add `cc-client-version` header for all calls
* Add network group routes in `api/v4/network-group.js`

## 7.7.0 (2022-01-05)

* utils/env-var:
  * add a json parser and return valid values
  * add a strict mode validation
  * add a warning error for Java validation

## 7.6.0 (2021-08-03)

* Add Jenkins addon provider v4 endpoint to get available updates
  * Add `GET /v4/addon-providers/jenkins/addons/{addonIdOrRealId} in `api/v4/addon-providers.js` with `
    getJenkinsUpdates()`

## 7.5.0 (2021-06-30)

* Add new addon providers v4 endpoints
  * Add `GET /v4/addon-providers/{addonProviderId}/addons/{addonIdOrRealId} in `api/v4/addon-providers.js` with `
    getAddon()`
  * Add `GET /v4/addon-providers/{addonProviderId}/clusters/{clusterId} in `api/v4/addon-providers.js` with `
    getCluster()`

## 7.4.0 (2021-04-13)

* Add new billing API endpoints
  * Add `GET /organisations/{id}/namespaces` in `api/v4/billing.js` with `getNamespaces()`
  * Add `GET /billing/organisations/{id}/invoices` in `api/v4/billing.js` with `getAllInvoices()`
  * Add `GET /billing/organisations/{id}/invoices/unpaid` in `api/v4/billing.js` with `getAllUnpaidInvoices()`
  * Add `GET /billing/organisations/{id}/invoices/{invoiceNumber}{type}` in `api/v4/billing.js` with `getInvoice()`
  * Add `GET /billing/organisations/{id}/payments/methods` in `api/v4/billing.js` with `getPaymentMethods()`
  * Add `POST /billing/organisations/{id}/payments/methods` in `api/v4/billing.js` with `createPaymentMethod()`
  * Add `PUT /billing/organisations/{id}/payments/methods/default` in `api/v4/billing.js`
    with `setDefaultPaymentMethod()`
  * Add `DELETE /billing/organisations/{id}/payments/methods/{methodId}` in `api/v4/billing.js`
    with `deletePaymentMethod()`
  * Add `POST /billing/organisations/{id}/invoices/{invoiceNumber}/payments/paypal` in `api/v4/billing.js`
    with `initPaypalPayment()`
  * Add `PUT /billing/organisations/{id}/invoices/{invoiceNumber}/payments/paypal/{payerId}` in `api/v4/billing.js`
    with `authorizePaypalPayment()`
  * Add `POST /billing/organisations/{id}/invoices/{invoiceNumber}/payments/stripe` in `api/v4/billing.js`
    with `initStripePayment()`
  * Add `PUT /billing/organisations/{id}/invoices/{invoiceNumber}/payments/stripe/{paymentId}` in `api/v4/billing.js`
    with `authorizeStripePayment()`
  * Add `GET /billing/organisations/{id}/payments/stripe/intent` in `api/v4/billing.js` with `getStripePaymentIntent()`

## 7.3.2 (2021-03-05)

* Update superagent

## 7.3.1 (2021-03-05)

* Update dependencies

## 7.3.0 (2021-03-05)

* Add `execWarpscript()` function for browsers with fetch
* Add new Warp10 requests around access logs
  * `getStatusCodesFromWarp10()`
  * `getRequestsFromWarp10()`
  * `getAccessLogsHeatmapFromWarp10()`
  * `getAccessLogsDotmapFromWarp10()`
* Add `withCache()` helper function
* Add `withOptions()` helper function
* Add timeout support for browser based request (API and Warp10)

## 7.2.0 (2021-01-26)

* Add new addon-providers API `GET /v4/addon-providers/{providerId}` in `api/v4/addon-providers.js`
  with `getAddonProvider()`.
* Fix client generation with new `/v4` routes

## 7.1.0 (2020-11-26)

* Expose app statuses

## 7.0.0 (2020-10-05)

* replace jest by [@web/test-runner](https://modern-web.dev/guides/test-runner/getting-started/)
* Add new zones API `GET /v4/product/zones` in `api/v4/product.js` with `getAllZones()`.

### ⚠️ BREAKING CHANGES

* Move `GET /products/zones` to `api/product` with `getAllZones()`
  * Used to be `api/unknown` with `todo_getZones()`

In order to support both v2 *and* v4 endpoints we changed the way we handle the version prefix.

* You no longer need to configure it as part of the `API_HOST` when you call `prefixUrl(API_HOST)` in
  your `sendToApi()`.
* You only need to defined the origin with no trailing slash. Example for production: `'https://api.clever-cloud.com'`.
* All v2 service modules that you imported from `esm/api` or `cjs/api` were moved to `esm/api/v2` or `cjs/api/v2`.

## 6.0.0 (2020-05-26)

* Add exponential backoff to the newly refactored `LogsStream` and `EventsStream`.
* Add docs about how to use those streams.

### ⚠️ BREAKING CHANGES

* Expose logs with a new `EventEmitter`/`EventTarget` compatible API
* Expose events with a new `EventEmitter`/`EventTarget` compatible API

## 5.1.0 (2020-03-27)

* Add `payment` param to `addTcpRedir()` in `api/application`

## 5.0.1 (2020-03-27)

Fix missing `/self` vs `/organisations/{id}`:

* Rename `POST /self/addons/preorders` to `api/addon` with `preorder()`
  * Used to be `api/addon` with `todo_preorderSelfAddon()`
* Rename `GET /organisations/{id}/applications/{appId}/deployments/{deploymentId}/instances` to `api/application`
  with `cancelDeployment()`
  * Used to be `api/application` with `getAllDeploymentInstances()`

## 5.0.0 (2020-03-27)

### ⚠️ BREAKING CHANGES

* Rename `POST /organisations/{id}/addons/preorders` to `api/addon` with `preorder()`
  * Used to be `api/addon` with `todo_preorderAddonByOrgaId()`
* Move `GET /products/addonproviders` to `api/product` with `getAllAddonProviders()`
  * Used to be `api/unknown` with `todo_getAddonProviders()`
* Move `GET /products/prices` to `api/product` with `getCreditPrice()`
  * Used to be `api/unknown` with `todo_getExcahngeRates()`
* Rename `GET /self/applications/{appId}/deployments/{deploymentId}/instances` to `api/application`
  with `cancelDeployment()`
  * Used to be `api/application` with `getAllDeploymentInstances()`

## 4.2.0 (2020-03-26)

* Add `GET /organisations/{id}/namespaces` in `api/organisation.js` with `getNamespaces()`
* Add `GET /organisations/{id}/applications/{appId}/tcpRedirs` in `api/application.js` with `getTcpRedirs()`
* Add `POST /organisations/{id}/applications/{appId}/tcpRedirs` in `api/application.js` with `addTcpRedir()`
* Add `DELETE /organisations/{id}/applications/{appId}/tcpRedirs/{sourcePort}` in `api/application.js`
  with `removeTcpRedir()`

## 4.1.0 (2020-03-20)

* Add `delay` param to `getContinuousAccessLogsFromWarp10()`

## 4.0.0 (2020-03-19)

### ⚠️ BREAKING CHANGES

Seems like a milliseconds API for access logs on Warp10 was not a good idea.
We changed it to be in microseconds and update the date util.

* Make inner `getAccessLogsFromWarp10()` accept `from` and `to` in microseconds.
* Make `getAccessLogsFromWarp10InBatches()` accept `from` and `to` in microseconds.
* Rename date util `toISOStringWithMicrosecondPrecision()` into `toMicroIsoString()`.
* Remove date util `asWarp10Timespan()`.
* Remove date util `ONE_HOUR`.
* Introduce date util `toMicroTimestamp()`.
* Introduce date util `ONE_HOUR_MICROS`.
* Introduce date util `ONE_SECOND_MICROS`.

## 3.1.2 (2020-03-18)

* Fix access logs continuous mechanism in `getContinuousAccessLogsFromWarp10()` use microseconds precision

## 3.1.1 (2020-03-18)

* Fix access logs continuous mechanism in `getContinuousAccessLogsFromWarp10()`

## 3.1.0 (2020-03-18)

* Add `GET /w10tokens/accessLogs/read/{orgaId}` in `api/warp-10.js` with `getWarp10AccessLogsToken()`
* Add access-logs requests (via Warp10) in `access-logs.js`
  * `getAccessLogsFromWarp10InBatches()` to fetch history access logs in batches (1h windows)
  * `getContinuousAccessLogsFromWarp10()` to fetch contiuous access logs in small batches
* Add `execWarpscript()` function for node with superagent
* Update `prefixUrl()`, when `url` is `undefined` it defaults to `''`
* Update dev and peer deps

## 3.0.0 (2020-03-06)

### ⚠️ BREAKING CHANGES

* Fix the serialization/parsing of env-vars

Please read [PR 18](https://github.com/CleverCloud/clever-client.js/pull/18) for more details.

## 2.3.1 (2020-03-02)

- request.superagent: expose an option to retry
- request.superagent: handle ECONNRESET errors

## 2.3.0 (2020-02-11)

- Remove es-addon specific routes

## 2.2.0 (2020-02-06)

- API endpoints update
- Add manual endpoints (backups and provider)
- fix: request.superagent can now return raw text if it's not `content-type: application/json`.

## 2.1.0 (2019-12-13)

- API endpoints update

## 2.0.1 (2019-09-23)

- Expose full responseBody on errors

## 2.0.0 (2019-09-20)

- Add app-status utils

## 2.0.0-beta.8 (2019-09-03)

- Fix JSON parsing with response Content-Type: application/json; charset=utf8 for real

## 2.0.0-beta.7 (2019-09-02)

- Fix JSON parsing with response Content-Type: application/json; charset=utf8

## 2.0.0-beta.6 (2019-09-02)

- Fix PUT /self/keys
- Fix PUT .../avatar

## 2.0.0-beta.5 (2019-08-30)

- Fix nonce manual usage

## 2.0.0-beta.4 (2019-08-28)

- Fix SSE (add a timeout when opening a stream)

## 2.0.0-beta.3 (2019-08-23)

- Remove some console.log

## 2.0.0-beta.2 (2019-08-23)

- Expose better helpers for streams (events and logs) for (browsers and node)

## 2.0.0-beta.1 (2019-08-02)

- Fix logs query param deployment_id naming

## 2.0.0-beta.0 (2019-08-01)

- Expose user.getSummary()
- Remove legacy getAuthorization()
- Replace request with superagent
- Provide error id on response.id (lecagy reasons)
- Make sure /cjs is cleared when invoking task "generate-cjs-modules"
- Expose helpers for WebSockets and ServerSentEvents endpoints
- Move some function in "product" service
- Add possibility to merge live OpenAPI doc with custom definitions (temporary lol)
- Use 'oauth-1.0a' for timestamps and nonce for anonymous requests
- Improve request support and error handling (browser & node)

## 1.0.1 (2019-07-25)

- Fix JSON handling for node (request.request.js)

## 1.0.0 (2019-07-25)

- utils/env-vars: utils/env-var: sort variables by name (`parseRaw` and `toNameEqualsValueString`)

## 1.0.0-beta.0 (2019-07-22)

First public stable release

- Exposes new thin ES6 class based and tree-shakable client
- Exposes legacy client (reusing new client under the hood)
