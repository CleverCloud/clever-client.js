/**
 * @import { ListProfileEmailAddressCommandOutput } from './list-profile-email-address-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { GetProfileCommand } from './get-profile-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<void, ListProfileEmailAddressCommandOutput>}
 * @endpoint [GET] /v2/self
 * @endpoint [GET] /v2/self/emails
 * @group Profile
 * @version 2
 */
export class ListProfileEmailAddressCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<void, ListProfileEmailAddressCommandOutput>['compose']} */
  async compose(_params, composer) {
    const [profile, secondaryEmailAddresses] = await Promise.all([
      composer.send(new GetProfileCommand()),
      composer.send(new ListProfileSecondaryEmailAddressCommand()),
    ]);

    return {
      primaryAddress: {
        address: profile.email,
        verified: profile.emailValidated,
      },
      secondaryAddresses: secondaryEmailAddresses.map((address) => ({
        address,
        verified: true,
      })),
    };
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<void, Array<string>>}
 * @endpoint [GET] /v2/self/emails
 * @group Profile
 * @version 2
 */
class ListProfileSecondaryEmailAddressCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, Array<string>>['toRequestParams']} */
  toRequestParams() {
    return get(`/v2/self/emails`);
  }

  /** @type {CcApiSimpleCommand<void, Array<string>>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response?.sort() ?? [];
  }
}
