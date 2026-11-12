import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { DeleteTokenCommandInput } from './delete-oauth-token-command.types.ts';

/**
 * Deletes an Oauth token.
 *
 * This command is for internal use only.
 *
 * @endpoint [DELETE] /v2/self/tokens/:XXX
 * @group Token
 * @version 2
 */
export class DeleteOauthTokenCommand extends CcApiSimpleCommand<DeleteTokenCommandInput, undefined> {
  toRequestParams(params: DeleteTokenCommandInput) {
    return delete_(safeUrl`/v2/self/tokens/${params.token}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  // the named token is revoked, so a replay only meets a not-found error
  isIdempotent(): boolean {
    return true;
  }
}
