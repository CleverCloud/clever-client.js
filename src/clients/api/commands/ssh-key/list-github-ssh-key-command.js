/**
 * @import { ListGithubSshKeyCommandOutput } from './list-github-ssh-key-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, ListGithubSshKeyCommandOutput>}
 * @endpoint [GET] /v2/github/keys
 * @group SshKey
 * @version 2
 */
export class ListGithubSshKeyCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, ListGithubSshKeyCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/v2/github/keys`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status, body) {
    return { isEmpty: status === 404 && body?.id === 7301, emptyValue: [] };
  }
}
