import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetStripeIntentCommandInput, GetStripeIntentCommandOutput } from './get-stripe-intent-command.types.js';

/**
 * Opens a Stripe setup intent so that a new payment method can be collected in the browser.
 *
 * The returned client secret is what the Stripe JS tools need to collect the card or the mandate;
 * the resulting payment method is then attached to the organisation with
 * {@link CreatePaymentMethodCommand}.
 *
 * @endpoint [GET] /v4/billing/organisations/:XXX/payments/stripe/intent
 * @group Payment
 * @version 4
 */
export class GetStripeIntentCommand extends CcApiSimpleCommand<
  GetStripeIntentCommandInput,
  GetStripeIntentCommandOutput
> {
  toRequestParams(params: GetStripeIntentCommandInput) {
    const queryParams = params.type != null ? new QueryParams().set('type', params.type) : undefined;
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/stripe/intent`, queryParams);
  }

  transformCommandOutput(response: unknown): GetStripeIntentCommandOutput {
    const res = response as GetStripeIntentCommandOutput;
    return {
      id: res.id,
      clientSecret: res.clientSecret,
      customer: res.customer,
    };
  }

  // every call asks Stripe for a brand new setup intent, so a replay leaves a second one behind
  isIdempotent(): boolean {
    return false;
  }
}
