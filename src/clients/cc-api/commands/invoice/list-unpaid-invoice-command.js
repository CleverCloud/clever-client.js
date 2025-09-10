/**
 * @import { ListUnpaidInvoiceCommandInput, ListUnpaidInvoiceCommandOutput } from './list-unpaid-invoice-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoiceSummary } from './invoice-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListUnpaidInvoiceCommandInput, ListUnpaidInvoiceCommandOutput>}
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices/unpaid
 * @group Invoice
 * @version 4
 */
export class ListUnpaidInvoiceCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListUnpaidInvoiceCommandInput, ListUnpaidInvoiceCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/unpaid`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<ListUnpaidInvoiceCommandInput, ListUnpaidInvoiceCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformInvoiceSummary), 'emissionDate');
  }
}
