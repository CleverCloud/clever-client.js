/**
 * @import { ListPersonalSshKeyCommandOutput } from './list-personal-ssh-key-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, ListPersonalSshKeyCommandOutput>}
 * @endpoint [GET] /v2/self/keys
 * @group SshKey
 * @version 2
 */
export class ListPersonalSshKeyCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, ListPersonalSshKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(`/v2/self/keys`);
  }

  /** @type {CcApiSimpleCommand<void, ListPersonalSshKeyCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
