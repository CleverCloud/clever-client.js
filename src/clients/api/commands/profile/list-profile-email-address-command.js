/**
 * @import { ListProfileEmailAddressCommandOutput } from './list-profile-email-address-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, ListProfileEmailAddressCommandOutput>}
 * @endpoint [GET] /v2/self/emails
 * @group Profile
 * @version 2
 */
export class ListProfileEmailAddressCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, ListProfileEmailAddressCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(`/v2/self/emails`);
  }

  /** @type {CcApiSimpleCommand<void, ListProfileEmailAddressCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
