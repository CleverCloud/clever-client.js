import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ListGithubSshKeyCommandOutput } from './list-github-ssh-key-command.types.js';

/**
 * @endpoint [GET] /v2/github/keys
 * @group SshKey
 * @version 2
 */
export class ListGithubSshKeyCommand extends CcApiSimpleCommand<void, ListGithubSshKeyCommandOutput> {
  toRequestParams() {
    return get(`/v2/github/keys`);
  }

  transformCommandOutput(response: unknown): ListGithubSshKeyCommandOutput {
    return sortBy(response as ListGithubSshKeyCommandOutput, 'name');
  }

  getEmptyResponsePolicy(status: number, body: unknown): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404 && (body as { id?: number })?.id === 7301, emptyValue: [] };
  }
}
