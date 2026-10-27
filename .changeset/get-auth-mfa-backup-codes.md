---
'@clevercloud/client': patch
---

`GetAuthMfaBackupCodesCommand` rejects with named error codes, and can resolve a wrong password instead

It used to reject with the raw cc-api ids. It now rejects with the codes of
`GET_AUTH_MFA_BACKUP_CODES_ERROR_CODES`:

| Before | After                          |
| ------ | ------------------------------ |
| `3029` | `clever.auth.invalid-password` |
| `3101` | `clever.auth.mfa-not-found`    |

Set `shouldResolveRefusedCredential: true` to get a wrong password as a result instead of a 401 reported to
`hooks.onError`: the command then resolves `{ type: 'retrieved', backupCodes }` or
`{ type: 'invalid-password' }`. Every other failure still rejects.

`GetAuthMfaBackupCodesCommandOutput` now names the output depending on the option. The default output is renamed
`GetAuthMfaBackupCodesCommandResponse`.
