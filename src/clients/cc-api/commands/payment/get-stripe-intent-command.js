/**
 * @import { GetStripeIntentCommandInput, GetStripeIntentCommandOutput } from './get-stripe-intent-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetStripeIntentCommandInput, GetStripeIntentCommandOutput>}
 * @endpoint [GET] /v4/billing/organisations/:XXX/payments/stripe/intent
 * @group Payment
 * @version 4
 */
export class GetStripeIntentCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetStripeIntentCommandInput, GetStripeIntentCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/stripe/intent`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetStripeIntentCommandInput, GetStripeIntentCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      id: response.id,
      clientSecret: response.clientSecret,
      customer: response.customer,
    };
  }
}
