---
'@clevercloud/client': patch
---

Add `GetAuthMfaCommand`, telling whether a second factor is turned on and how many of its backup codes are left

It needs no password. It rejects with `clever.auth.almighty-token-required` (`GET_AUTH_MFA_ERROR_CODES`) when the
client authenticates with a token not allowed to read the account security settings.
`backupCodesState.generatedAt` is not the real generation date for a set of codes generated before the API
recorded it: avoid showing it as such.
