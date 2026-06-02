import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetInvoiceHtmlCommandInput, GetInvoiceHtmlCommandOutput } from './get-invoice-html-command.types.js';

/**
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices/:XXX.html
 * @group Invoice
 * @version 4
 */
export class GetInvoiceHtmlCommand extends CcApiSimpleCommand<GetInvoiceHtmlCommandInput, GetInvoiceHtmlCommandOutput> {
  toRequestParams(params: GetInvoiceHtmlCommandInput): Partial<CcRequestParams> {
    return {
      method: 'GET',
      url: safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}.html`,
      headers: new HeadersBuilder().acceptTextHtml().build(),
    };
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
