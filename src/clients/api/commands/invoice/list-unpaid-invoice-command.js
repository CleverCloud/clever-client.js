/**
 * @import { ListUnpaidInvoiceCommandInput, ListUnpaidInvoiceCommandOutput } from './list-unpaid-invoice-command.types.js';
 */
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListUnpaidInvoiceCommandInput, ListUnpaidInvoiceCommandOutput>}
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices/unpaid
 * @group Invoice
 * @version 4
 */
export class ListUnpaidInvoiceCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListUnpaidInvoiceCommandInput, ListUnpaidInvoiceCommandOutput>['toRequestParams']} */
  toRequestParams(params) {}
}
