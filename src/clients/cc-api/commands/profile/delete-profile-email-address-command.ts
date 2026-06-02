/**
 * @import { DeleteProfileEmailAddressCommandInput } from './delete-profile-email-address-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteProfileEmailAddressCommandInput, void>}
 * @endpoint [DELETE] /v2/self/emails/:XXX
 * @group Profile
 * @version 2
 */
export class DeleteProfileEmailAddressCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteProfileEmailAddressCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/self/emails/${params.address}`);
  }

  /** @type {CcApiSimpleCommand<DeleteProfileEmailAddressCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
