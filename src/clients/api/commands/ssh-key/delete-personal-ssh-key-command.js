/**
 * @import { DeletePersonalSshKeyCommandInput, DeletePersonalSshKeyCommandOutput } from './delete-personal-ssh-key-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeletePersonalSshKeyCommandInput, DeletePersonalSshKeyCommandOutput>}
 * @endpoint [DELETE] /v2/self/keys/:XXX
 * @group SshKey
 * @version 2
 */
export class DeletePersonalSshKeyCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeletePersonalSshKeyCommandInput, DeletePersonalSshKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/self/keys/:XXX`);
  }
}
