import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetInvoiceCommandInput, GetInvoiceCommandOutput } from './get-invoice-command.types.js';
import { transformInvoice } from './invoice-transform.js';

/**
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices/:XXX
 * @group Invoice
 * @version 4
 */
export class GetInvoiceCommand extends CcApiSimpleCommand<GetInvoiceCommandInput, GetInvoiceCommandOutput> {
  toRequestParams(params: GetInvoiceCommandInput) {
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetInvoiceCommandOutput {
    return transformInvoice(response);
  }
}
