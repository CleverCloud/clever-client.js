---
'@clevercloud/client': patch
---

`RequestAuthPasswordResetCommand` rejects with `clever.auth.password-reset-email-failed` instead of `2401` when the reset email cannot be sent
