/**
 * @import { ListInvoiceCommandInput, ListInvoiceCommandOutput } from './list-invoice-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListInvoiceCommandInput, ListInvoiceCommandOutput>}
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices
 * @group Invoice
 * @version 4
 */
export class ListInvoiceCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListInvoiceCommandInput, ListInvoiceCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/invoices`);
  }
}
