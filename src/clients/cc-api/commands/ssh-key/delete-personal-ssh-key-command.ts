import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DeletePersonalSshKeyCommandInput } from './delete-personal-ssh-key-command.types.js';

/**
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
}
