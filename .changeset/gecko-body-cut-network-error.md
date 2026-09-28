---
'@clevercloud/client': patch
---

Streams now reconnect in Firefox when the server cuts the connection mid-response

Firefox words that failure differently from the other engines, and the client did not recognise it as a
network failure. A stream hit it on every server restart, failed for good instead of retrying, and
rejected with a bare `TypeError` instead of a `CcNetworkError`.
