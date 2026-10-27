---
'@clevercloud/client': patch
---

`DeleteAuthMfaCommand` rejects with named error codes, and can resolve a wrong password instead

It used to reject with the raw cc-api ids. It now rejects with the codes of `DELETE_AUTH_MFA_ERROR_CODES`:

| Before | After                          |
| ------ | ------------------------------ |
| `3029` | `clever.auth.invalid-password` |
| `3101` | `clever.auth.mfa-not-found`    |

Set `shouldResolveRefusedCredential: true` to get a wrong password as a result instead of a 401 reported to
`hooks.onError`: the command then resolves `{ type: 'deleted' }` or `{ type: 'invalid-password' }`. Every
other failure still rejects.
