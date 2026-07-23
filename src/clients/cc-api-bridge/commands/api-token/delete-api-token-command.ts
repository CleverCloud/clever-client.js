import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';
import type { DeleteApiTokenCommandInput } from './delete-api-token-command.types.js';

/**
 * Revokes an API token, which stops being accepted immediately.
 *
 * The OAuth tokens the API token was standing in for are revoked as well, so the credential is gone
 * on both sides.
 *
 * @endpoint [DELETE] /api-tokens/:XXX
 * @group ApiToken
 */
export class DeleteApiTokenCommand extends CcApiBridgeCommand<DeleteApiTokenCommandInput, undefined> {
  toRequestParams(params: DeleteApiTokenCommandInput) {
    return delete_(safeUrl`/api-tokens/${params.apiTokenId}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
