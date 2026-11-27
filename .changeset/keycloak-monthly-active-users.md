---
'@clevercloud/client': patch
---

Expose `monthlyActiveUsers` on the output of `GetKeycloakInfoCommand`, `UpdateKeycloakVersionCommand` and `CreateKeycloakNetworkGroupCommand`

It counts the distinct users active since midnight UTC on the first day of the current month, and is `undefined` when the API cannot read it.
