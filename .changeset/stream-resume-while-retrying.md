---
'@clevercloud/client': patch
---

Keep `resume()` from opening a second connection while a stream waits to reconnect

Both connections delivered their events, and `close()` left one of them open.
