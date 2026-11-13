import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { DeletePersonalSshKeyCommandInput } from './delete-personal-ssh-key-command.types.ts';

/**
 * Removes a public SSH key from the current user's account.
 *
 * @endpoint [DELETE] /v2/self/keys/:XXX
 * @group SshKey
 * @version 2
 */
export class DeletePersonalSshKeyCommand extends CcApiSimpleCommand<DeletePersonalSshKeyCommandInput, undefined> {
  toRequestParams(params: DeletePersonalSshKeyCommandInput) {
    return delete_(safeUrl`/v2/self/keys/${params.name}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  isIdempotent(): boolean {
    return true;
  }
}
