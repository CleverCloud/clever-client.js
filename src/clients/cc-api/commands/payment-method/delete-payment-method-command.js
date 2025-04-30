/**
 * @import { DeletePaymentMethodCommandInput, DeletePaymentMethodCommandOutput } from './delete-payment-method-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeletePaymentMethodCommandInput, DeletePaymentMethodCommandOutput>}
 * @endpoint [DELETE] /v4/billing/organisations/:XXX/payments/methods/:XXX
 * @group PaymentMethod
 * @version 4
 */
export class DeletePaymentMethodCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeletePaymentMethodCommandInput, DeletePaymentMethodCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/methods/${params.token}`);
  }
}
