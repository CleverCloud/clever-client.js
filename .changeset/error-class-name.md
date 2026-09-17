---
'@clevercloud/client': patch
---

Name the errors the client throws after their class

`CcClientError`, `CcRequestError`, `CcNetworkError`, `CcHttpError`, `DomainParseError`, `PollingInterruptedError` and `PollingTimeoutError` used to report `Error` as their `name`. Their stack traces and `String(error)` started with `Error:` too.
