---
'@clevercloud/client': patch
---

Remove `GetAuthMfaBackupCodesCommand`: the API no longer shows backup codes after they are issued

They are now returned once, by `ConfirmAuthMfaCommand` when the factor is turned on and by
`ResetAuthMfaBackupCodesCommand`, which replaces them with a new set. To show how many are left, use
`GetAuthMfaCommand`. `GET_AUTH_MFA_BACKUP_CODES_ERROR_CODES` and the `GetAuthMfaBackupCodes*` types are gone too.

```diff
-import { GetAuthMfaBackupCodesCommand } from '@clevercloud/client/cc-api-commands/auth/get-auth-mfa-backup-codes-command.js';
-const backupCodes = await client.send(new GetAuthMfaBackupCodesCommand({ kind: 'TOTP', password }));
+import { ResetAuthMfaBackupCodesCommand } from '@clevercloud/client/cc-api-commands/auth/reset-auth-mfa-backup-codes-command.js';
+const { backupCodes } = await client.send(new ResetAuthMfaBackupCodesCommand({ kind: 'TOTP', password }));
```

The replacement invalidates the previous codes: call it only when the user asks for a new set.
