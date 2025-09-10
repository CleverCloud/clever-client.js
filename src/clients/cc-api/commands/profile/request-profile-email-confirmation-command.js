/**
 * @import { RequestProfileEmailConfirmationCommandOutput } from './request-profile-email-confirmation-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, RequestProfileEmailConfirmationCommandOutput>}
 * @endpoint [GET] /v2/self/confirmation_email
 * @group Profile
 * @version 2
 */
export class RequestProfileEmailConfirmationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, RequestProfileEmailConfirmationCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/v2/self/confirmation_email`);
  }
}
