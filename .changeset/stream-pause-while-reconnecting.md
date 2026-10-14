---
'@clevercloud/client': patch
---

`pause()` now works while a stream is connecting or retrying, and cancels the reconnection

It can also be called from `onOpen()` and `onRetry()` listeners. It still throws on a stream not started yet, already paused or closed.
