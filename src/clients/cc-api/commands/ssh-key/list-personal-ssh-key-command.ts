import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ListPersonalSshKeyCommandOutput } from './list-personal-ssh-key-command.types.js';

/**
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
}
