/**
 * @import { GetInvoicePdfCommandInput, GetInvoicePdfCommandOutput } from './get-invoice-pdf-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetInvoicePdfCommandInput, GetInvoicePdfCommandOutput>}
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices/:XXX.pdf
 * @group Invoice
 * @version 4
 */
export class GetInvoicePdfCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetInvoicePdfCommandInput, GetInvoicePdfCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return {
      method: 'GET',
      url: safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}.pdf`,
      headers: new HeadersBuilder().accept('application/pdf').build(),
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
