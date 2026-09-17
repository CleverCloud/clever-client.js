---
'@clevercloud/client': patch
---

Stop setting a `cause` on the errors raised without one

`CcClientError` and its subclasses used to carry a `cause` set to `undefined`, which `util.inspect()` printed. The `cause` of a `DomainParseError` is no longer enumerable either, so `JSON.stringify()` and the spread operator leave it out, as they do for native errors.
