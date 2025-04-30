/**
 * @import { AuthorizePaypalCommandInput, AuthorizePaypalCommandOutput } from './authorize-paypal-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoice } from '../invoice/invoice-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<AuthorizePaypalCommandInput, AuthorizePaypalCommandOutput>}
 * @endpoint [PUT] /v4/billing/organisations/:XXX/invoices/:XXX/payments/paypal/:XXX
 * @group Payment
 * @version 4
 */
export class AuthorizePaypalCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<AuthorizePaypalCommandInput, AuthorizePaypalCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(
      safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}/payments/paypal/${params.transactionId}`,
    );
  }

  /** @type {CcApiSimpleCommand<AuthorizePaypalCommandInput, AuthorizePaypalCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformInvoice(response);
  }
}
