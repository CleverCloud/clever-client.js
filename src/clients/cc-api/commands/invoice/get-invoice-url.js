/**
 * @import { GetInvoiceUrlInput } from './get-invoice-url.types.js';
 */
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiGetUrl } from '../../lib/cc-api-get-url.js';

/**
 * @extends {CcApiGetUrl<GetInvoiceUrlInput>}
 * @group Invoice
 */
export class GetInvoiceUrl extends CcApiGetUrl {
  /** @type {CcApiGetUrl<GetInvoiceUrlInput>['get']} */
  get(params) {
    return safeUrl`v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}.${params.format}`;
  }
}
