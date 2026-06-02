import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';
import type { DeleteApiTokenCommandInput } from './delete-api-token-command.types.js';

/**
 * Delete an API token
 *
 * @endpoint [DELETE] /api-tokens/:XXX
 * @group ApiToken
 */
export class DeleteApiTokenCommand extends CcApiBridgeCommand<DeleteApiTokenCommandInput, void> {
  toRequestParams(params: DeleteApiTokenCommandInput) {
    return delete_(safeUrl`/api-tokens/${params.apiTokenId}`);
  }
}
