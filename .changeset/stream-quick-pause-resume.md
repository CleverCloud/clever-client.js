---
'@clevercloud/client': patch
---

Keep a stream open when `pause()` and `resume()` are called in quick succession

It could close instead, usually rejecting the promise `start()` returned with an `AbortError`.
