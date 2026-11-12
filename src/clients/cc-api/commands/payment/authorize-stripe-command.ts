import { put } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import { transformInvoice } from '../invoice/invoice-transform.ts';
import type { AuthorizeStripeCommandInput, AuthorizeStripeCommandOutput } from './authorize-stripe-command.types.ts';

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

  // the handler settles the invoice again whenever the intent reads as succeeded, so a replay mails a second paid
  // invoice and notifies a second payment attempt
  isIdempotent(): boolean {
    return false;
  }
}
