/**
 * @import { GetInvoiceCommandInput, GetInvoiceCommandOutput } from './get-invoice-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoice } from './invoice-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetInvoiceCommandInput, GetInvoiceCommandOutput>}
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices/:XXX
 * @group Invoice
 * @version 4
 */
export class GetInvoiceCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetInvoiceCommandInput, GetInvoiceCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetInvoiceCommandInput, GetInvoiceCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformInvoice(response);
  }
}
