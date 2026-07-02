import { safeUrl } from '../../../../lib/utils.js';
import { CcApiGetUrl } from '../../lib/cc-api-get-url.js';
import type { GetInvoiceUrlInput } from './get-invoice-url.types.js';

/**
 * @group Invoice
 */
export class GetInvoiceUrl extends CcApiGetUrl<GetInvoiceUrlInput> {
  get(params: GetInvoiceUrlInput): string {
    return safeUrl`v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}.${params.format}`;
  }
}
