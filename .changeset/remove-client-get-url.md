---
'@clevercloud/client': patch
---

Remove `getUrl()` from the clients

It existed to build authenticated links, putting the credentials in the URL's query string; `GetInvoiceUrl` was its last use. Nothing replaces it: send the matching command with `client.send()`, which authenticates through the `Authorization` header.
