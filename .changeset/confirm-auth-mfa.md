---
'@clevercloud/client': patch
---

`ConfirmAuthMfaCommand` rejects with named error codes, and can resolve a wrong password or code instead

It used to reject with the raw cc-api ids. It now rejects with the codes of `CONFIRM_AUTH_MFA_ERROR_CODES`:

| Before | After                                 |
| ------ | ------------------------------------- |
| `3029` | `clever.auth.invalid-password`        |
| `3103` | `clever.auth.invalid-mfa-code`        |
| `3102` | `clever.auth.mfa-already-enabled`     |
| `3101` | `clever.auth.mfa-enrolment-not-found` |

Set `shouldResolveRefusedCredential: true` to get a wrong password or a wrong code from the authenticator app as
a result instead of an error reported to `hooks.onError`: the command then resolves `{ type: 'confirmed' }`,
`{ type: 'invalid-password' }` or `{ type: 'invalid-mfa-code' }`. Every other failure still rejects.
