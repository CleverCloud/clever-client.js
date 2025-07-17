/**
 * @import { ListApiTokenCommandOutput } from './list-api-token-command.types.js'
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';

/**
 * List API tokens
 *
 * @extends {CcApiBridgeCommand<void, ListApiTokenCommandOutput>}
 * @endpoint [GET] /api-tokens
 * @group ApiToken
 */
export class ListApiTokenCommand extends CcApiBridgeCommand {
  /** @type {CcApiBridgeCommand<void, ListApiTokenCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/api-tokens`);
  }
}
