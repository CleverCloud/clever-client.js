/**
 * @import { CreateProfileEmailAddressCommandInput } from './create-profile-email-address-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * Adds a new email address to the user profile.
 *
 * Common error codes:
 * - `clever.profile.email-address.invalid-format`: the email adresse format is invalid
 * - `clever.profile.email-address.already-defined`: the email adresse already belongs to the user
 * - `clever.profile.email-address.invalid-format`: the email adresse already belongs to another user
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

  /** @type {CcApiSimpleCommand<?, ?>['transformErrorCode']} */
  transformErrorCode(errorCode) {
    if (errorCode === '550') {
      return 'clever.profile.email-address.invalid-format';
    }
    if (errorCode === '101') {
      return 'clever.profile.email-address.already-defined';
    }
    if (errorCode === '1004') {
      return 'clever.profile.email-address.already-used';
    }
    return errorCode;
  }
}
