import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoiceSummary } from './invoice-transform.js';
import type { ListInvoiceCommandInput, ListInvoiceCommandOutput } from './list-invoice-command.types.js';

/**
 * Lists the billing documents an organisation was issued over a period.
 *
 * Invoices and credit notes are returned together, told apart by the `kind` field, and the detailed
 * lines are left out. When the period is left open, the API defaults to the current year.
 *
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
    return sortBy((response as Array<unknown>).map(transformInvoiceSummary), 'emittedAt');
  }

  isIdempotent(): boolean {
    return true;
  }
}
