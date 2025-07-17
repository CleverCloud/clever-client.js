/**
 * @import { SetPrimaryPaymentMethodCommandInput, SetPrimaryPaymentMethodCommandOutput } from './set-primary-payment-method-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformPaymentMethod } from './payment-method-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<SetPrimaryPaymentMethodCommandInput, SetPrimaryPaymentMethodCommandOutput>}
 * @endpoint [PUT] /v4/billing/organisations/:XXX/payments/methods/default
 * @group PaymentMethod
 * @version 4
 */
export class SetPrimaryPaymentMethodCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<SetPrimaryPaymentMethodCommandInput, SetPrimaryPaymentMethodCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/methods/default`, {
      id: params.id,
    });
  }

  /** @type {CcApiSimpleCommand<SetPrimaryPaymentMethodCommandInput, SetPrimaryPaymentMethodCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformPaymentMethod(response);
  }
}
