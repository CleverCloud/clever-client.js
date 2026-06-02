import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  CreatePaymentMethodCommandInput,
  CreatePaymentMethodCommandOutput,
} from './create-payment-method-command.types.js';
import { transformPaymentMethod } from './payment-method-transform.js';

/**
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
}
