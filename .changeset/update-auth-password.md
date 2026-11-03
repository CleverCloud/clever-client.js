---
'@clevercloud/client': patch
---

`UpdateAuthPasswordCommand` tells a wrong current password from an invalid new one

A wrong current password (`403`, error id `7301`) now rejects with `clever.auth.invalid-password`, and a new password
not between 12 and 4096 characters long (`400`, error id `3002`) with `clever.auth.invalid-new-password`, both in
`UPDATE_AUTH_PASSWORD_ERROR_CODES`. The `504` validation error is told apart the same way, from the fields of its
body: read the code instead of `error.response.body.fields`.
