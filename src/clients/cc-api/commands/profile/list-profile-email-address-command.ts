import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { GetProfileCommand } from './get-profile-command.js';
import type { ListProfileEmailAddressCommandOutput } from './list-profile-email-address-command.types.js';

/**
 * Lists every email address of the signed-in user, primary one included.
 *
 * The primary address only appears on the profile, the secondary ones behind their own endpoint, so
 * both are fetched in parallel and merged.
 *
 * @endpoint [GET] /v2/self
 * @endpoint [GET] /v2/self/emails
 * @group Profile
 * @version 2
 */
export class ListProfileEmailAddressCommand extends CcApiCompositeCommand<void, ListProfileEmailAddressCommandOutput> {
  async compose(_params: void, composer: CcApiComposer): Promise<ListProfileEmailAddressCommandOutput> {
    const [profile, secondaryEmailAddresses] = await Promise.all([
      composer.send(new GetProfileCommand()),
      composer.send(new ListProfileSecondaryEmailAddressCommand()),
    ]);

    return {
      primaryAddress: {
        address: profile.emailAddress,
        isVerified: profile.isEmailValidated,
      },
      secondaryAddresses: secondaryEmailAddresses.map((address) => ({
        address,
        isVerified: true,
      })),
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Lists the secondary email addresses of the signed-in user.
 *
 * @endpoint [GET] /v2/self/emails
 * @group Profile
 * @version 2
 */
class ListProfileSecondaryEmailAddressCommand extends CcApiSimpleCommand<void, Array<string>> {
  toRequestParams() {
    return get(`/v2/self/emails`);
  }

  transformCommandOutput(response: Array<string>) {
    return response?.sort() ?? [];
  }

  isIdempotent(): boolean {
    return true;
  }
}
