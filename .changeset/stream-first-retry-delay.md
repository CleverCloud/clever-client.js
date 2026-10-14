---
'@clevercloud/client': patch
---

Make the first reconnection of a stream wait `initRetryTimeout`, not `initRetryTimeout × backoffFactor`
