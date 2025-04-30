/**
 * @import { GetInvoiceHtmlCommandInput, GetInvoiceHtmlCommandOutput } from './get-invoice-html-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetInvoiceHtmlCommandInput, GetInvoiceHtmlCommandOutput>}
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices/:XXX.html
 * @group Invoice
 * @version 4
 */
export class GetInvoiceHtmlCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetInvoiceHtmlCommandInput, GetInvoiceHtmlCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return {
      method: 'GET',
      url: safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}.html`,
      headers: new HeadersBuilder().acceptTextHtml().build(),
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
