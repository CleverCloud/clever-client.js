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

  /** @type {CcApiSimpleCommand<void, ListGithubSshKeyCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status, body) {
    return status === 400 && body.id === 7301;
  }

  /** @type {CcApiSimpleCommand<void, ListGithubSshKeyCommandOutput>['getEmptyResponse']} */
  getEmptyResponse() {
    return [];
  }
}
