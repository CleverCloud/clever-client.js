import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.ts';
import type { DeleteApiTokenCommandInput } from './delete-api-token-command.types.ts';

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

  // the token is looked up before being dropped, so a replay revokes nothing more and answers "unknown token id"
  isIdempotent(): boolean {
    return true;
  }
}
