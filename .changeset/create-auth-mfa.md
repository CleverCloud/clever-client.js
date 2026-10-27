---
'@clevercloud/client': patch
---

`CreateAuthMfaCommand` rejects with named error codes, and can resolve a wrong password instead

It used to reject with the raw cc-api ids. It now rejects with the codes of `CREATE_AUTH_MFA_ERROR_CODES`:

| Before | After                             |
| ------ | --------------------------------- |
| `3029` | `clever.auth.invalid-password`    |
| `8502` | `clever.auth.email-not-validated` |
| `3102` | `clever.auth.mfa-already-enabled` |

A wrong password rejects with a 401, which reaches the `hooks.onError` callback of `CcApiClient` and can read
as an expired session. Set `shouldResolveRefusedCredential: true` to get it as a result instead, never reported:
the command then resolves `{ type: 'created', url }` or `{ type: 'invalid-password' }`. Every other failure
still rejects. Without the option, nothing changes at runtime.

`CreateAuthMfaCommandOutput` now names the output depending on the option. The default output is renamed
`CreateAuthMfaCommandResponse`.

```js
const result = await client.send(new CreateAuthMfaCommand({ kind: 'TOTP', password, shouldResolveRefusedCredential: true }));
if (result.type === 'invalid-password') {
  askForThePasswordAgain();
}
```
