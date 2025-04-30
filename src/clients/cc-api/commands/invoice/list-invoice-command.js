/**
 * @import { ListInvoiceCommandInput, ListInvoiceCommandOutput } from './list-invoice-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoiceSummary } from './invoice-transform.js';

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
    return get(
      safeUrl`/v4/billing/organisations/${params.ownerId}/invoices`,
      new QueryParams()
        .set('since', normalizeDate(params.since))
        .set('until', normalizeDate(params.until))
        .set('limit', params.limit),
    );
  }

  /** @type {CcApiSimpleCommand<ListInvoiceCommandInput, ListInvoiceCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformInvoiceSummary), 'emissionDate');
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
