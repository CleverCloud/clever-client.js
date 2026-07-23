import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetInvoiceCommandInput, GetInvoiceCommandOutput } from './get-invoice-command.types.js';
import { transformInvoice } from './invoice-transform.js';

/**
 * Retrieves one billing document of an organisation, with all of its detailed lines.
 *
 * The endpoint serves both invoices and the credit notes that void them, told apart by the `kind`
 * field. The totals are computed by the API from the lines rather than stored.
 *
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices/:XXX
 * @group Invoice
 * @version 4
 */
export class GetInvoiceCommand extends CcApiSimpleCommand<GetInvoiceCommandInput, GetInvoiceCommandOutput> {
  toRequestParams(params: GetInvoiceCommandInput) {
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}`);
  }

  transformCommandOutput(response: unknown): GetInvoiceCommandOutput {
    return transformInvoice(response);
  }
}
