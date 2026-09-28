---
'@clevercloud/client': patch
---

`CreateApiTokenCommand` can resolve a refused credential instead of rejecting

A wrong password or MFA code rejects with a 401, which reaches the `hooks.onError` callback of
`CcApiBridgeClient` and can read as an expired session. Set `shouldResolveRefusedCredential: true`
to get it as a result instead, never reported. The output is then discriminated on `type`:

- `created`: the token;
- `invalid-credential`: the email address or the password is wrong;
- `invalid-mfa-code`: the MFA code is wrong, or missing on an account that has one enrolled.

Every other failure still rejects. Without the option, nothing changes.

```js
const result = await client.send(new CreateApiTokenCommand({ ...input, shouldResolveRefusedCredential: true }));
if (result.type === 'created') {
  store(result.apiToken);
}
```
