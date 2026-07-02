import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoiceSummary } from './invoice-transform.js';
import type { ListInvoiceCommandInput, ListInvoiceCommandOutput } from './list-invoice-command.types.js';

/**
 * @endpoint [GET] /v4/billing/organisations/:XXX/invoices
 * @group Invoice
 * @version 4
 */
export class ListInvoiceCommand extends CcApiSimpleCommand<ListInvoiceCommandInput, ListInvoiceCommandOutput> {
  toRequestParams(params: ListInvoiceCommandInput) {
    return get(
      safeUrl`/v4/billing/organisations/${params.ownerId}/invoices`,
      new QueryParams()
        .set('since', normalizeDate(params.since))
        .set('until', normalizeDate(params.until))
        .set('limit', params.limit),
    );
  }

  transformCommandOutput(response: unknown): ListInvoiceCommandOutput {
    return sortBy((response as Array<unknown>).map(transformInvoiceSummary), 'emissionDate');
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
