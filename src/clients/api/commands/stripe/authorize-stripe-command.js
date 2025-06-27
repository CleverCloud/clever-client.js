/**
 * @import { AuthorizeStripeCommandInput, AuthorizeStripeCommandOutput } from './authorize-stripe-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<AuthorizeStripeCommandInput, AuthorizeStripeCommandOutput>}
 * @endpoint [PUT] /v4/billing/organisations/:XXX/invoices/:XXX/payments/stripe/:XXX
 * @group Stripe
 * @version 4
 */
export class AuthorizeStripeCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<AuthorizeStripeCommandInput, AuthorizeStripeCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(
      safeUrl`/v4/billing/organisations/${params.ownerId}/invoices/${params.invoiceNumber}/payments/stripe/${params.intentId}`,
    );
  }
}
