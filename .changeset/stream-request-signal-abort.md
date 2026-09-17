---
'@clevercloud/client': patch
---

Close a stream when the `signal` of its request aborts, whenever it aborts

`start()` now rejects with `signal.reason` as soon as the signal aborts: before the stream starts, while it reads events, while it is paused, or while it waits to reconnect. The stream used to ignore a signal aborted before it started. An abort while reading failed with `SSE_SERVER_ERROR`, or reconnected with a `retry` configuration. An abort while paused or waiting to reconnect only closed the stream at the next attempt.
