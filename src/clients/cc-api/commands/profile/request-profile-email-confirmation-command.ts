import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * Sends the confirmation email again to the user's unconfirmed primary address.
 *
 * @endpoint [GET] /v2/self/confirmation_email
 * @group Profile
 * @version 2
 */
export class RequestProfileEmailConfirmationCommand extends CcApiSimpleCommand<void, undefined> {
  toRequestParams() {
    return get(`/v2/self/confirmation_email`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  // the whole point of the endpoint is to send a mail, so a replay sends a second one
  isIdempotent(): boolean {
    return false;
  }
}
