---
'@clevercloud/client': patch
---

Send one summary request instead of one per command when resolving ids concurrently

`CcApiClient` fills in the `ownerId` a command needs, and translates between the two add-on id
formats, from an index it builds from the organisation summary. Sending several commands at once on
a cold index used to request that summary once per command. They now share a single request.
