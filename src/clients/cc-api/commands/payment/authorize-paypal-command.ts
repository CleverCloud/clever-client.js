import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoice } from '../invoice/invoice-transform.js';
import type { AuthorizePaypalCommandInput, AuthorizePaypalCommandOutput } from './authorize-paypal-command.types.js';

/**
 * @endpoint [PUT] /v4/billing/organisations/:XXX/invoices/:XXX/payments/paypal/:XXX
 * @group Payment
 * @version 4
 */
export class AuthorizePaypalCommand extends CcApiSimpleCommand<
  AuthorizePaypalCommandInput,
  AuthorizePaypalCommandOutput
> {
  toRequestParams(params: AuthorizePaypalCommandInput) {
    return put(
      safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}/payments/paypal/${params.transactionId}`,
    );
  }

  transformCommandOutput(response: unknown): AuthorizePaypalCommandOutput {
    return transformInvoice(response);
  }
}
