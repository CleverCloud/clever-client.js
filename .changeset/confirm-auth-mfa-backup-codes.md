---
'@clevercloud/client': patch
---

`ConfirmAuthMfaCommand` resolves the backup codes of the factor it turns on, instead of `undefined`

The API shows them only in this response: save them or show them to the user right away. With
`shouldResolveRefusedCredential: true`, the `confirmed` result carries them too.

```diff
-await client.send(new ConfirmAuthMfaCommand({ kind: 'TOTP', code, password }));
+const { backupCodes } = await client.send(new ConfirmAuthMfaCommand({ kind: 'TOTP', code, password }));
```
