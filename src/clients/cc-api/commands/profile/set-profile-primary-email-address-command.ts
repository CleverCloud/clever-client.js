import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { SetProfilePrimaryEmailAddressCommandInput } from './set-profile-primary-email-address-command.types.js';

/**
 * @endpoint [PUT] /v2/self/emails/:XXX
 * @group Profile
 * @version 2
 */
export class SetProfilePrimaryEmailAddressCommand extends CcApiSimpleCommand<
  SetProfilePrimaryEmailAddressCommandInput,
  undefined
> {
  toRequestParams(params: SetProfilePrimaryEmailAddressCommandInput) {
    return put(safeUrl`/v2/self/emails/${params.address}`, { make_primary: true });
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
