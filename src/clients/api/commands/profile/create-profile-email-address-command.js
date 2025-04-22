import { put } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * @import { CreateProfileEmailAddressCommandInput, CreateProfileEmailAddressCommandOutput } from './create-profile-email-address-command.types.js';
 */

/**
 * @extends {CcApiSimpleCommand<CreateProfileEmailAddressCommandInput, CreateProfileEmailAddressCommandOutput>}
 */
export class CreateProfileEmailAddressCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateProfileEmailAddressCommandInput, CreateProfileEmailAddressCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(`/v2/self/emails/${params.emailAddress}`, {
      // eslint-disable-next-line camelcase
      make_primary: params.primary,
    });
  }
}
