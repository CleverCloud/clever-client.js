---
'@clevercloud/client': patch
---

Stop failing event streams opened at the same time on the same URL

Both streams used to fail before receiving any event, one with `SSE_SERVER_ERROR` and the other with a locked `ReadableStream` error.
