# Clever Client changelog

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
