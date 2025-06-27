/**
 * @import { CreateProfileEmailAddressCommandInput } from './create-profile-email-address-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateProfileEmailAddressCommandInput, void>}
 * @endpoint [PUT] /v2/self/emails/:XXX
 * @group Profile
 * @version 2
 */
export class CreateProfileEmailAddressCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateProfileEmailAddressCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/self/emails/${params.address}`, {});
  }

  /** @type {CcApiSimpleCommand<CreateProfileEmailAddressCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
