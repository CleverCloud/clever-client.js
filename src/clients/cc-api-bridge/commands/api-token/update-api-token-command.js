/**
 * @import { UpdateApiTokenCommandInput } from './update-api-token-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';

/**
 * Update an API token
 *
 * @extends {CcApiBridgeCommand<UpdateApiTokenCommandInput, void>}
 * @endpoint [PUT] /api-tokens/:XXX
 * @group ApiToken
 */
export class UpdateApiTokenCommand extends CcApiBridgeCommand {
  /** @type {CcApiBridgeCommand<UpdateApiTokenCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/api-tokens/${params.apiTokenId}`, {
      name: params.name,
      description: params.description,
    });
  }
}
