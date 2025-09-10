/**
 * @import { InitPaypalCommandInput, InitPaypalCommandOutput } from './init-paypal-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<InitPaypalCommandInput, InitPaypalCommandOutput>}
 * @endpoint [POST] /v4/billing/organisations/:XXX/invoices/:XXX/payments/paypal
 * @group Payment
 * @version 4
 */
export class InitPaypalCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<InitPaypalCommandInput, InitPaypalCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}/payments/paypal`);
  }
}
