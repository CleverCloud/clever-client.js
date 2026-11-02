---
'@clevercloud/client': patch
---

Add `ResetAuthMfaBackupCodesCommand`, replacing the backup codes with a new set returned once

The previous codes stop working. It rejects with the codes of `RESET_AUTH_MFA_BACKUP_CODES_ERROR_CODES`, and
takes `shouldResolveRefusedCredential` like the other commands asking for the password.
