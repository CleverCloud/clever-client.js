import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  ListPaymentMethodCommandInput,
  ListPaymentMethodCommandOutput,
} from './list-payment-method-command.types.js';
import { transformPaymentMethod } from './payment-method-transform.js';

/**
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

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
