---
'@clevercloud/client': patch
---

Remove `GetInvoiceUrl`

The URL it built through `client.getUrl()` carried the user's credentials in its query string, where they leak into browser history, server logs and `Referer` headers. Nothing replaces it: fetch the PDF with `GetInvoicePdfCommand`, which authenticates through the `Authorization` header, or serve the document from your own backend and link to that instead.

```diff
-import { GetInvoiceUrl } from '@clevercloud/client/cc-api-commands/invoice/get-invoice-url.js';
-const url = client.getUrl(new GetInvoiceUrl({ ownerId, invoiceNumber, format: 'pdf' }));
-link.href = url.toString();
+import { GetInvoicePdfCommand } from '@clevercloud/client/cc-api-commands/invoice/get-invoice-pdf-command.js';
+const pdf = await client.send(new GetInvoicePdfCommand({ ownerId, invoiceNumber }));
+link.href = URL.createObjectURL(pdf);
```

For the HTML rendering (`format: 'html'`), use `GetInvoiceHtmlCommand`, which returns the page as a string.
