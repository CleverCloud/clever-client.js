/**
 * @import { ListPaymentMethodCommandInput, ListPaymentMethodCommandOutput } from './list-payment-method-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListPaymentMethodCommandInput, ListPaymentMethodCommandOutput>}
 * @endpoint [GET] /v4/billing/organisations/:XXX/payments/methods
 * @group PaymentMethod
 * @version 4
 */
export class ListPaymentMethodCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListPaymentMethodCommandInput, ListPaymentMethodCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/billing/organisations/:XXX/payments/methods`);
  }

  /** @type {CcApiSimpleCommand<ListPaymentMethodCommandInput, ListPaymentMethodCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
