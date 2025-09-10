/**
 * @import { CreatePaymentMethodCommandInput, CreatePaymentMethodCommandOutput } from './create-payment-method-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformPaymentMethod } from './payment-method-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreatePaymentMethodCommandInput, CreatePaymentMethodCommandOutput>}
 * @endpoint [POST] /v4/billing/organisations/:XXX/payments/methods
 * @group PaymentMethod
 * @version 4
 */
export class CreatePaymentMethodCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreatePaymentMethodCommandInput, CreatePaymentMethodCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/methods`, {
      id: params.id,
    });
  }

  /** @type {CcApiSimpleCommand<CreatePaymentMethodCommandInput, CreatePaymentMethodCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformPaymentMethod(response);
  }
}
