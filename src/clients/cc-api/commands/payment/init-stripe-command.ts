import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoice } from '../invoice/invoice-transform.js';
import type { InitStripeCommandInput, InitStripeCommandOutput } from './init-stripe-command.types.js';

/**
 * Opens a Stripe payment for an invoice by charging it on the payment method of the organisation.
 *
 * The charge may need the payer to confirm the intent in the browser, in which case the payment
 * only settles once {@link AuthorizeStripeCommand} is called with that intent.
 *
 * @endpoint [POST] /v4/billing/organisations/:XXX/invoices/:XXX/payments/stripe
 * @group Payment
 * @version 4
 */
export class InitStripeCommand extends CcApiSimpleCommand<InitStripeCommandInput, InitStripeCommandOutput> {
  toRequestParams(params: InitStripeCommandInput) {
    return post(safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}/payments/stripe`);
  }

  transformCommandOutput(response: unknown): InitStripeCommandOutput {
    return transformInvoice(response);
  }
}
