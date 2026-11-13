import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { DeletePaymentMethodCommandInput } from './delete-payment-method-command.types.ts';

/**
 * Detaches a payment method from an organisation.
 *
 * @endpoint [DELETE] /v4/billing/organisations/:XXX/payments/methods/:XXX
 * @group PaymentMethod
 * @version 4
 */
export class DeletePaymentMethodCommand extends CcApiSimpleCommand<DeletePaymentMethodCommandInput, undefined> {
  toRequestParams(params: DeletePaymentMethodCommandInput) {
    return delete_(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/methods/${params.token}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  // the handler detaches the payment method and answers `204` either way, so a replay detaches nothing more
  isIdempotent(): boolean {
    return true;
  }
}
