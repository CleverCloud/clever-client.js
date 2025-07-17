/**
 * @import { InitStripeCommandInput, InitStripeCommandOutput } from './init-stripe-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformInvoice } from '../invoice/invoice-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<InitStripeCommandInput, InitStripeCommandOutput>}
 * @endpoint [POST] /v4/billing/organisations/:XXX/invoices/:XXX/payments/stripe
 * @group Payment
 * @version 4
 */
export class InitStripeCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<InitStripeCommandInput, InitStripeCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}/payments/stripe`);
  }

  /** @type {CcApiSimpleCommand<InitStripeCommandInput, InitStripeCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformInvoice(response);
  }
}
