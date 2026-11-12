import { post } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  CreatePaymentMethodCommandInput,
  CreatePaymentMethodCommandOutput,
} from './create-payment-method-command.types.ts';
import { transformPaymentMethod } from './payment-method-transform.ts';

/**
 * Attaches a payment method to an organisation.
 *
 * The payment method itself is created on the Stripe side, with the Stripe JS tools and the intent
 * returned by {@link GetStripeIntentCommand}; this command only registers the resulting identifier
 * so that the invoices of the organisation can be charged on it.
 *
 * @endpoint [POST] /v4/billing/organisations/:XXX/payments/methods
 * @group PaymentMethod
 * @version 4
 */
export class CreatePaymentMethodCommand extends CcApiSimpleCommand<
  CreatePaymentMethodCommandInput,
  CreatePaymentMethodCommandOutput
> {
  toRequestParams(params: CreatePaymentMethodCommandInput) {
    return post(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/methods`, {
      id: params.id,
    });
  }

  transformCommandOutput(response: unknown): CreatePaymentMethodCommandOutput {
    return transformPaymentMethod(response);
  }

  // the handler attaches the Stripe payment method the body names, so a replay attaches the same one rather than a
  // second card
  isIdempotent(): boolean {
    return true;
  }
}
