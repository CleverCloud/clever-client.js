---
'@clevercloud/client': patch
---

Stop a stream with retries from reconnecting for ever when the response is not an event stream

It now fails with `SSE_INVALID_CONTENT_TYPE` once its retries are spent, without firing `onOpen()`.
