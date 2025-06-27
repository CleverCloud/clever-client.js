/**
 * @import { SetProfilePrimaryEmailAddressCommandInput } from './set-profile-primary-email-address-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<SetProfilePrimaryEmailAddressCommandInput, void>}
 * @endpoint [PUT] /v2/self/emails/:XXX
 * @group Profile
 * @version 2
 */
export class SetProfilePrimaryEmailAddressCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<SetProfilePrimaryEmailAddressCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    // eslint-disable-next-line camelcase
    return put(safeUrl`/v2/self/emails/${params.address}`, { make_primary: true });
  }

  /** @type {CcApiSimpleCommand<SetProfilePrimaryEmailAddressCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
