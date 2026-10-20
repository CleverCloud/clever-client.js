---
'@clevercloud/client': patch
---

Replace `onError()` and the `error` event of streams with `onRetry()`

`onError()` was only ever called when the stream was about to reconnect, never for an error ending it, which still only rejects the promise `start()` returns. `onRetry()` is called at the same time with `{ error, retryCount, maxRetryCount, retryAt }`, `retryCount` starting at 1:

```diff
-stream.onError((error) => showReconnecting(error, stream.retryCount + 1));
-stream.on('error', (event) => showReconnecting(event.data, stream.retryCount + 1));
+stream.onRetry(({ error, retryCount }) => showReconnecting(error, retryCount));
```
