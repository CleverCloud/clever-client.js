import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { RequestProfileEmailConfirmationCommandOutput } from './request-profile-email-confirmation-command.types.js';

/**
 * @endpoint [GET] /v2/self/confirmation_email
 * @group Profile
 * @version 2
 */
export class RequestProfileEmailConfirmationCommand extends CcApiSimpleCommand<
  void,
  RequestProfileEmailConfirmationCommandOutput
> {
  toRequestParams() {
    return get(`/v2/self/confirmation_email`);
  }
}
