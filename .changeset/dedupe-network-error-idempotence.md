---
'@clevercloud/client': patch
---

Make `CcNetworkError.isWorthRetrying()` answer for the command of each caller when identical requests sent at the same time fail together

A caller used to get the answer computed for the first one, even when its command declared a different idempotence.
