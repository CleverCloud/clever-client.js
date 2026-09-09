import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DeleteProfileEmailAddressCommandInput } from './delete-profile-email-address-command.types.js';

/**
 * Removes a secondary email address from the user profile.
 *
 * The primary address cannot be removed; another one has to be promoted first.
 *
 * @endpoint [DELETE] /v2/self/emails/:XXX
 * @group Profile
 * @version 2
 */
export class DeleteProfileEmailAddressCommand extends CcApiSimpleCommand<
  DeleteProfileEmailAddressCommandInput,
  undefined
> {
  toRequestParams(params: DeleteProfileEmailAddressCommandInput) {
    return delete_(safeUrl`/v2/self/emails/${params.address}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  isIdempotent(): boolean {
    return true;
  }
}
