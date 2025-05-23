/**
 * @import { CreateProfileEmailAddressCommandInput, CreateProfileEmailAddressCommandOutput } from './create-profile-email-address-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateProfileEmailAddressCommandInput, CreateProfileEmailAddressCommandOutput>}
 * @endpoint [PUT] /v2/self/emails/:XXX
 * @group Profile
 * @version 2
 */
export class CreateProfileEmailAddressCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateProfileEmailAddressCommandInput, CreateProfileEmailAddressCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/self/emails/:XXX`, {});
  }
}
