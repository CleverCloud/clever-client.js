---
'@clevercloud/client': patch
---

Add the missing commands to the new client, and align the existing ones on the same conventions

The commands under `@clevercloud/client/cc-api-commands/` now cover the endpoints that had no command
yet. The ones that already existed were reviewed as a whole: their names, their inputs, their outputs
and their error codes follow the same rules across the client. Several of them changed shape in the
process.
