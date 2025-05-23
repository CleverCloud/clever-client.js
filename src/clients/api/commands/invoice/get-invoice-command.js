/**
 * @import { GetInvoiceCommandInput, GetInvoiceCommandOutput } from './get-invoice-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetInvoiceCommandInput, GetInvoiceCommandOutput>}
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices/:XXX:XXX
 * @group Invoice
 * @version 4
 */
export class GetInvoiceCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetInvoiceCommandInput, GetInvoiceCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/billing/organisations/:XXX/invoices/:XXX:XXX`);
  }

  /** @type {CcApiSimpleCommand<GetInvoiceCommandInput, GetInvoiceCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
