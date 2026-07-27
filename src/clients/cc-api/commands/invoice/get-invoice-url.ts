import { safeUrl } from '../../../../lib/utils.js';
import { CcApiGetUrl } from '../../lib/cc-api-get-url.js';
import type { GetInvoiceUrlInput } from './get-invoice-url.types.js';

/**
 * Builds the URL one billing document is served at, in the given format.
 *
 * Nothing is sent: this only returns the path, for a link or a download the browser performs on its
 * own.
 *
 * @group Invoice
 */
export class GetInvoiceUrl extends CcApiGetUrl<GetInvoiceUrlInput> {
  get(params: GetInvoiceUrlInput): string {
    return safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}.${params.format}`;
  }
}
