# ADR 0001: Why did we build this new client?

This ADR tries to put more context on why we decided to build our own REST client generator.

## Why a new client?

The old client has a few limitations:

* Strongly coupled to Bacon.js (old version 0.9.x)
* Strongly coupled to lodash for simple stuffs
* Coupled with WadlClient (which generates the client and its API at the runtime)
  * Hard to static code analysis on what it exposed and what is used
  * Hard to do autocomplete
  * The generated API is strongly coupled to the way the differents REST paths are exposed
  * The way we have to pass some params twice is weird, the inner HTTP details of a call are not hidden
* The `crypto` module is used for oAuth v1 signature (even in browser)
  * This means Web apps have to bundle lots of crazy polyfills
* The universal packaging is weird with (`typeof require == "function" && require("lodash") ? require("lodash") : _,`)
* The `querystring` is used while we now have a native alternative like `URLSearchParams`
* Strongly coupled to how the auth works (oAuth v1 signature) 
* oAuth v1 signature is partly done by hand
* Impossible to tree-shake (we need to be able to create tiny Web Components with the minimum amount of client code)
* Hard to hook a 401 trap on errors
* Some code is calling `localStorage` in a `if (isBrowser)` 

The new client solves most of those problems:

* The API is not coupled to how the request is authenticated
  * Users can easily do oAuth v1 signature the way they want (`crypto` on node and `WebCrypto` on browsers)
  * Users could use another auth method in the future (biscuit or else)
* The API is not coupled to an HTTP library
  * Users can chose the way HTTP request and sent and handled (browser or node, axios, jQuery, superagent...)
* Users can hook stuffs before and after calls (log, handle errors, add analytics...)
* Code can be tree-shaked
* Usage can statically analysed
* Functions have JSDoc and autocomplete

## Why custom code to generate it?

The landscape of codegen in the swagger community is a mess:

With [https://github.com/swagger-api/swagger-js](swagger-api/swagger-js):

* You need to load the whole OpenAPI doc at runtime
* The functions are exposed with `apis[tag][operationId]:ExecuteFunction`
  * The operationId is strongly coupled to the original Java source function name
  * The operationId should be unique to the whole document
  * Calls can have multiple tags and our existing tags are better for our docs
  * You can't tree shake this, it's very close to what we had with WadlClient

With [https://github.com/wcandillon/swagger-js-codegen](wcandillon/swagger-js-codegen):

* This project is no longer actively maintained by its creator
* Strongly coupled to the superagent HTTP lib

With [https://github.com/swagger-api/swagger-codegen](swagger-api/swagger-codegen):

* You also get one big client object for all calls
* Strongly coupled to the superagent HTTP lib
* uses `querystring`

We chose to build our own codegen for various reasons:

* We wanted everything to be decoupled to
  * build the smallest client possible
  * match different environments and contexts
  * adapt to new auth mechanism
  * be able to generate a legacy wrapper around our client
