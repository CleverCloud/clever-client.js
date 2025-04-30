/**
 * @import { ListPaymentMethodCommandInput, ListPaymentMethodCommandOutput } from './list-payment-method-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformPaymentMethod } from './payment-method-transform.js';

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
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/payments/methods`);
  }

  /** @type {CcApiSimpleCommand<ListPaymentMethodCommandInput, ListPaymentMethodCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(transformPaymentMethod);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
