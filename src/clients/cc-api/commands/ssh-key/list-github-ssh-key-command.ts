import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ListGithubSshKeyCommandOutput } from './list-github-ssh-key-command.types.js';

/**
 * Lists the public SSH keys the current user has on their linked GitHub account.
 *
 * Meant to offer them for import, so a user does not have to paste a key they already published.
 *
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
}
