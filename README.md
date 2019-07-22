# JavaScript REST client and utils for Clever Cloud's API 

## What is this?

This project contains a REST client for Clever Cloud's API and some utils.

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
