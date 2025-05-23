/**
 * @import { ListApiTokenCommandOutput } from './list-api-token-command.types.js'
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { AuthBackendCommand } from '../../lib/auth-backend-command.js';

/**
 * @extends {AuthBackendCommand<void, ListApiTokenCommandOutput>}
 */
export class ListApiTokenCommand extends AuthBackendCommand {
  /** @type {AuthBackendCommand<void, ListApiTokenCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/api-tokens`);
  }
}
