---
'@clevercloud/client': patch
---

Keep a stream from connecting once `close()` was called

A stream closed right after `start()`, or while it reconnected, could still connect and stay open with no listeners.
