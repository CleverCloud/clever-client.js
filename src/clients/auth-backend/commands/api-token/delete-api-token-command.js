/**
 * @import { DeleteApiTokenCommandInput } from './delete-api-token-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { AuthBackendCommand } from '../../lib/auth-backend-command.js';

/**
 *
 * @extends {AuthBackendCommand<DeleteApiTokenCommandInput, void>}
 * @endpoint [DELETE] /api-tokens/:XXX
 * @group ApiToken
 */
export class DeleteApiTokenCommand extends AuthBackendCommand {
  /** @type {AuthBackendCommand<DeleteApiTokenCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/api-tokens/:XXX`);
  }
}
