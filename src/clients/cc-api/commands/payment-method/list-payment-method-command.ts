import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  ListPaymentMethodCommandInput,
  ListPaymentMethodCommandOutput,
} from './list-payment-method-command.types.ts';
import { transformPaymentMethod } from './payment-method-transform.ts';

/**
 * Lists the payment methods registered on an organisation.
 *
 * @endpoint [GET] /v4/billing/organisations/:XXX/payments/methods
 * @group PaymentMethod
 * @version 4
 */
export class ListPaymentMethodCommand extends CcApiSimpleCommand<
  ListPaymentMethodCommandInput,
  ListPaymentMethodCommandOutput
> {
  toRequestParams(params: ListPaymentMethodCommandInput) {
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/methods`);
  }

  transformCommandOutput(response: unknown): ListPaymentMethodCommandOutput {
    return (response as Array<unknown>).map(transformPaymentMethod);
  }

  isIdempotent(): boolean {
    return true;
  }
}
