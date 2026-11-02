---
'@clevercloud/client': patch
---

Recognize the commands, query params and errors created by another copy of `@clevercloud/client`

An application bundling two copies of the client (two versions resolved by its dependencies) no longer fails to send a composite command built with one copy through a client built with the other. `isCcClientError()`, `isCcRequestError()`, `isCcHttpError()`, `isNetworkError()`, `isTimeoutError()`, `isInterruptedError()` and the predicates built on them now match the errors raised by either copy. Both copies must include this release: an older copy brands nothing, so its objects stay unrecognized, and it does not recognize the objects of this copy either.
