---
'@clevercloud/client': patch
---

Remove the `protected` `_`-prefixed methods from `CcApiClient`, `CcApiBridgeClient` and `RedisHttpClient`

`_send`, `_compose`, `_transformCommandParams`, `_transformStreamParams`, `_getCommandRequestParams`, `_prepareRequest`, `_handleResponse` and `_getRequestSignal` were internals exposed to subclasses. They are gone, with no replacement: a subclass overriding or calling one of them must stop doing so. Use the `onRequest` and `onResponse` hooks to act on requests and responses.
