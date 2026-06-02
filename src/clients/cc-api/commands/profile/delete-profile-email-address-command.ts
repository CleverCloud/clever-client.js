import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DeleteProfileEmailAddressCommandInput } from './delete-profile-email-address-command.types.js';

/**
 * @endpoint [DELETE] /v2/self/emails/:XXX
 * @group Profile
 * @version 2
 */
export class DeleteProfileEmailAddressCommand extends CcApiSimpleCommand<DeleteProfileEmailAddressCommandInput, void> {
  toRequestParams(params: DeleteProfileEmailAddressCommandInput) {
    return delete_(safeUrl`/v2/self/emails/${params.address}`);
  }

  transformCommandOutput(): void {
    return null;
  }
}
