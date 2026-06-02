import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformPaymentMethod } from './payment-method-transform.js';
import type {
  SetPrimaryPaymentMethodCommandInput,
  SetPrimaryPaymentMethodCommandOutput,
} from './set-primary-payment-method-command.types.js';

/**
 * @endpoint [PUT] /v4/billing/organisations/:XXX/payments/methods/default
 * @group PaymentMethod
 * @version 4
 */
export class SetPrimaryPaymentMethodCommand extends CcApiSimpleCommand<
  SetPrimaryPaymentMethodCommandInput,
  SetPrimaryPaymentMethodCommandOutput
> {
  toRequestParams(params: SetPrimaryPaymentMethodCommandInput) {
    return put(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/methods/default`, {
      id: params.id,
    });
  }

  transformCommandOutput(response: unknown): SetPrimaryPaymentMethodCommandOutput {
    return transformPaymentMethod(response);
  }
}
