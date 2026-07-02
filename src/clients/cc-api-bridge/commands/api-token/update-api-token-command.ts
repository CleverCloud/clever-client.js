import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';
import type { UpdateApiTokenCommandInput } from './update-api-token-command.types.js';

/**
 * Update an API token
 *
 * @endpoint [PUT] /api-tokens/:XXX
 * @group ApiToken
 */
export class UpdateApiTokenCommand extends CcApiBridgeCommand<UpdateApiTokenCommandInput, undefined> {
  toRequestParams(params: UpdateApiTokenCommandInput) {
    return put(safeUrl`/api-tokens/${params.apiTokenId}`, {
      name: params.name,
      description: params.description,
    });
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
