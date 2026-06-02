import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetStripeIntentCommandInput, GetStripeIntentCommandOutput } from './get-stripe-intent-command.types.js';

/**
 * @endpoint [GET] /v4/billing/organisations/:XXX/payments/stripe/intent
 * @group Payment
 * @version 4
 */
export class GetStripeIntentCommand extends CcApiSimpleCommand<
  GetStripeIntentCommandInput,
  GetStripeIntentCommandOutput
> {
  toRequestParams(params: GetStripeIntentCommandInput) {
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/stripe/intent`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetStripeIntentCommandOutput {
    const res = response as GetStripeIntentCommandOutput;
    return {
      id: res.id,
      clientSecret: res.clientSecret,
      customer: res.customer,
    };
  }
}
