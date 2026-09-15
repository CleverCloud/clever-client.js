---
'@clevercloud/client': patch
---

Call the `onError` hook once per error, even when it rejects several `send()` calls

Resolving the owner or add-on id of a command used to report a failure twice. Identical `GET` requests sent at the same time share one request, and used to report a network failure or a timeout once per call. An HTTP error response is still reported once per call.
