import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoice } from '../invoice/invoice-transform.js';
import type {
  InitStripeCommandInput,
  InitStripeCommandOutput,
  InitStripePaymentMethod,
} from './init-stripe-command.types.js';

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
    return post(
      safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}/payments/stripe`,
      toStripePaymentMethodBody(params.paymentMethod),
    );
  }

  transformCommandOutput(response: unknown): InitStripeCommandOutput {
    return transformInvoice(response);
  }

  // the handler records a new payment attempt and opens a Stripe payment intent, and the idempotency key it sends to
  // Stripe only covers the current hour
  isIdempotent(): boolean {
    return false;
  }
}

/**
 * Maps the payment method to the JSON body the `StripePaymentMethod` route decodes.
 */
function toStripePaymentMethodBody(paymentMethod: InitStripePaymentMethod) {
  if (paymentMethod.kind === 'NEW') {
    return { type: 'NEW_CARD', token: paymentMethod.token, deviceData: paymentMethod.deviceData };
  }
  return { type: 'EXISTING_CARD', token: paymentMethod.paymentMethodId };
}
