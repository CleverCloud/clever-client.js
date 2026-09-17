---
'@clevercloud/client': patch
---

Treat an option set to `undefined` in a request or stream configuration as an absent option

It now keeps the value it would have without it. `{ signal: controller?.signal }` without a controller used to drop the `signal` of `defaultRequestConfig`, so aborting that signal no longer aborted the request. Likewise, `timeout: undefined` made a request fail at once with `TIMEOUT_EXCEEDED`, and `isCorsEnabled: undefined` overrode the value a command needs.
