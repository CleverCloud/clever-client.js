/**
 * @import { AuthorizePaypalCommandInput, AuthorizePaypalCommandOutput } from './authorize-paypal-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<AuthorizePaypalCommandInput, AuthorizePaypalCommandOutput>}
 * @endpoint [PUT] /v4/billing/organisations/:XXX/invoices/:XXX/payments/paypal/:XXX
 * @group Paypal
 * @version 4
 */
export class AuthorizePaypalCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<AuthorizePaypalCommandInput, AuthorizePaypalCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v4/billing/organisations/:XXX/invoices/:XXX/payments/paypal/:XXX`, {});
  }
}
