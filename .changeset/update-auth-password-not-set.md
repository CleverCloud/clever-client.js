---
'@clevercloud/client': patch
---

`UpdateAuthPasswordCommand` rejects with `clever.auth.password-not-set` for an account that has no password yet

Such an account, signed up through an OAuth provider, used to get `clever.auth.invalid-password`, which read as a
wrong current password. Its first password is set through `RequestAuthPasswordResetCommand`. The code is in
`UPDATE_AUTH_PASSWORD_ERROR_CODES`.
