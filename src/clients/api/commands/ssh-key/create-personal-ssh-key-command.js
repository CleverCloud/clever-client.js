/**
 * @import { CreatePersonalSshKeyCommandInput, CreatePersonalSshKeyCommandOutput } from './create-personal-ssh-key-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreatePersonalSshKeyCommandInput, CreatePersonalSshKeyCommandOutput>}
 * @endpoint [PUT] /v2/self/keys/:XXX
 * @group SshKey
 * @version 2
 */
export class CreatePersonalSshKeyCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreatePersonalSshKeyCommandInput, CreatePersonalSshKeyCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/self/keys/:XXX`, {});
  }
}
