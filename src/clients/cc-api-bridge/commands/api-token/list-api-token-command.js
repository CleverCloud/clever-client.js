/**
 * @import { ListApiTokenCommandOutput } from './list-api-token-command.types.js'
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';

/**
 * @extends {CcApiBridgeCommand<void, ListApiTokenCommandOutput>}
 */
export class ListApiTokenCommand extends CcApiBridgeCommand {
  /** @type {CcApiBridgeCommand<void, ListApiTokenCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/api-tokens`);
  }
}
