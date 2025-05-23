/**
 * @import { UpdateApiTokenCommandInput } from './update-api-token-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { AuthBackendCommand } from '../../lib/auth-backend-command.js';

/**
 *
 * @extends {AuthBackendCommand<UpdateApiTokenCommandInput, void>}
 * @endpoint [PUT] /api-tokens/:XXX
 * @group ApiToken
 */
export class UpdateApiTokenCommand extends AuthBackendCommand {
  /** @type {AuthBackendCommand<UpdateApiTokenCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/api-tokens/:XXX`, {});
  }
}
