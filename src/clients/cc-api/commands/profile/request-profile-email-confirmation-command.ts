import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * @endpoint [GET] /v2/self/confirmation_email
 * @group Profile
 * @version 2
 */
export class RequestProfileEmailConfirmationCommand extends CcApiSimpleCommand<void, void> {
  toRequestParams() {
    return get(`/v2/self/confirmation_email`);
  }

  transformCommandOutput(): void {
    return null;
  }
}
