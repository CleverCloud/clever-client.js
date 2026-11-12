---
'@clevercloud/client': patch
---

Private state of the classes is now held in `_`-prefixed properties instead of native `#` private fields

Instances of the clients, commands, streams and errors now show these properties when inspected, listed with `Object.keys()` or serialized with `JSON.stringify()`.
They are not part of the public API: read the public getters instead.
