import { put } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { SetProfilePrimaryEmailAddressCommandInput } from './set-profile-primary-email-address-command.types.ts';

/**
 * Promotes one of the user's email addresses to be the primary one.
 *
 * The primary address is where notifications and invoices are sent. The address has to be confirmed
 * already.
 *
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

  // an address the account does not own yet gets a confirmation link mailed on every call
  isIdempotent(): boolean {
    return false;
  }
}
