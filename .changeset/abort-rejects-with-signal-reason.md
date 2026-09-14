---
'@clevercloud/client': patch
---

Reject an aborted request with the reason of its `signal`, and stop reporting it to the `onError` hook

An aborted `send()` used to reject with a `CcRequestError` carrying the `ABORTED` code. It now rejects with `signal.reason`, as `fetch()` does. That is a `DOMException` named `AbortError`, unless `abort()` was given another reason. `ABORTED` is removed from `CC_REQUEST_ERROR_CODES`.

A stream whose request `signal` aborts while it connects rejects `start()` the same way, instead of reconnecting when it has a `retry` configuration.

To detect an abort, check the signal you passed rather than the error:

```diff
 try {
   await client.send(command, { signal });
 } catch (error) {
-  if (isCcRequestErrorWithCode(error, 'ABORTED')) {
+  if (signal.aborted) {
     return;
   }
   throw error;
 }
```
