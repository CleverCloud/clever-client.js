import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  DeletePaymentMethodCommandInput,
  DeletePaymentMethodCommandOutput,
} from './delete-payment-method-command.types.js';

/**
 * @endpoint [DELETE] /v4/billing/organisations/:XXX/payments/methods/:XXX
 * @group PaymentMethod
 * @version 4
 */
export class DeletePaymentMethodCommand extends CcApiSimpleCommand<
  DeletePaymentMethodCommandInput,
  DeletePaymentMethodCommandOutput
> {
  toRequestParams(params: DeletePaymentMethodCommandInput) {
    return delete_(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/methods/${params.token}`);
  }
}
