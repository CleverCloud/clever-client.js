import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetInvoicePdfCommandInput, GetInvoicePdfCommandOutput } from './get-invoice-pdf-command.types.js';

/**
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices/:XXX.pdf
 * @group Invoice
 * @version 4
 */
export class GetInvoicePdfCommand extends CcApiSimpleCommand<GetInvoicePdfCommandInput, GetInvoicePdfCommandOutput> {
  toRequestParams(params: GetInvoicePdfCommandInput): Partial<CcRequestParams> {
    return {
      method: 'GET',
      url: safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}.pdf`,
      headers: new HeadersBuilder().accept('application/pdf').build(),
    };
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
