---
'@clevercloud/client': patch
---

`UpdateAuthPasswordCommand` tells a wrong current password from an invalid new one

Its `504` validation error now rejects with `clever.auth.invalid-password` when the current password is wrong,
and with `clever.auth.invalid-new-password` when only the new one is invalid, both in
`UPDATE_AUTH_PASSWORD_ERROR_CODES`. Read the code instead of `error.response.body.fields`.
