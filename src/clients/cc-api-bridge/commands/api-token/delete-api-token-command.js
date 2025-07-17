/**
 * @import { DeleteApiTokenCommandInput } from './delete-api-token-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';

/**
 * Delete an API token
 *
 * @extends {CcApiBridgeCommand<DeleteApiTokenCommandInput, void>}
 * @endpoint [DELETE] /api-tokens/:XXX
 * @group ApiToken
 */
export class DeleteApiTokenCommand extends CcApiBridgeCommand {
  /** @type {CcApiBridgeCommand<DeleteApiTokenCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/api-tokens/${params.apiTokenId}`);
  }
}
