---
'@clevercloud/client': patch
---

`stream.state` is now `retrying`, not `paused`, while a stream waits to reconnect

`paused` now only means the consumer paused the stream. Code reading `paused` as "reconnecting" must read `retrying`:

```diff
-if (stream.state === 'paused') showReconnecting();
+if (stream.state === 'retrying') showReconnecting();
```
