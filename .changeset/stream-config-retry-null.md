---
'@clevercloud/client': patch
---

Disable the retries of a stream when its configuration sets `retry` to `null`

Both `client.stream(command, { retry: null })` and `defaultStreamConfig: { retry: null }` used to keep retrying with the retry configuration they were meant to override.
