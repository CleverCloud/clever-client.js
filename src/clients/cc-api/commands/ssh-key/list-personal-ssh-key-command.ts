import { get } from '../../../../lib/request/request-params-builder.ts';
import { sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { ListPersonalSshKeyCommandOutput } from './list-personal-ssh-key-command.types.ts';

/**
 * Lists the public SSH keys registered on the current user's account.
 *
 * @endpoint [GET] /v2/self/keys
 * @group SshKey
 * @version 2
 */
export class ListPersonalSshKeyCommand extends CcApiSimpleCommand<void, ListPersonalSshKeyCommandOutput> {
  toRequestParams() {
    return get(`/v2/self/keys`);
  }

  transformCommandOutput(response: unknown): ListPersonalSshKeyCommandOutput {
    return sortBy(response as ListPersonalSshKeyCommandOutput, 'name');
  }

  isIdempotent(): boolean {
    return true;
  }
}
