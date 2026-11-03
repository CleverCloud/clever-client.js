---
'@clevercloud/client': patch
---

Document that replaying `ConfirmAuthMfaCommand` rejects with `clever.auth.mfa-enrolment-not-found`

The factor is on by then, but the backup codes are lost with the first response: check `GetAuthMfaCommand`, then
get a new set with `ResetAuthMfaBackupCodesCommand`.
