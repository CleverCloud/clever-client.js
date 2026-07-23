import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoice } from '../invoice/invoice-transform.js';
import type { AuthorizeStripeCommandInput, AuthorizeStripeCommandOutput } from './authorize-stripe-command.types.js';

/**
 * Verifies the Stripe payment intent against Stripe, and settles the invoice with it.
 *
 * This is the second half of a Stripe payment: {@link InitStripeCommand} opens it, and this command
 * is called with the intent identifier once it was confirmed in the browser.
 *
 * @endpoint [PUT] /v4/billing/organisations/:XXX/invoices/:XXX/payments/stripe/:XXX
 * @group Payment
 * @version 4
 */
export class AuthorizeStripeCommand extends CcApiSimpleCommand<
  AuthorizeStripeCommandInput,
  AuthorizeStripeCommandOutput
> {
  toRequestParams(params: AuthorizeStripeCommandInput) {
    return put(
      safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}/payments/stripe/${params.intentId}`,
    );
  }

  transformCommandOutput(response: unknown): AuthorizeStripeCommandOutput {
    return transformInvoice(response);
  }
}
