import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoiceSummary } from './invoice-transform.js';
import type {
  ListUnpaidInvoiceCommandInput,
  ListUnpaidInvoiceCommandOutput,
} from './list-unpaid-invoice-command.types.js';

/**
 * Lists the invoices of an organisation that are still waiting to be paid.
 *
 * Unpaid means `PENDING`, `PROCESSING` or `PAYMENTHELD`: neither paid, nor cancelled, nor refunded.
 * The whole history is looked at, not only the current period.
 *
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices/unpaid
 * @group Invoice
 * @version 4
 */
export class ListUnpaidInvoiceCommand extends CcApiSimpleCommand<
  ListUnpaidInvoiceCommandInput,
  ListUnpaidInvoiceCommandOutput
> {
  toRequestParams(params: ListUnpaidInvoiceCommandInput) {
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/unpaid`);
  }

  transformCommandOutput(response: unknown): ListUnpaidInvoiceCommandOutput {
    return sortBy((response as Array<unknown>).map(transformInvoiceSummary), 'emittedAt');
  }
}
