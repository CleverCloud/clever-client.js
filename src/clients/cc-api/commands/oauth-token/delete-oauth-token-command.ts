import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DeleteTokenCommandInput } from './delete-oauth-token-command.types.js';

/**
 * Deletes an Oauth token.
 *
 * This command is for internal use only.
 *
 * @endpoint [DELETE] /v2/self/tokens
 * @group Token
 * @version 2
 */
export class DeleteOauthTokenCommand extends CcApiSimpleCommand<DeleteTokenCommandInput, void> {
  toRequestParams(params: DeleteTokenCommandInput) {
    return delete_(`/v2/self/tokens/${params.token}`);
  }

  transformCommandOutput(): void {
    return null;
  }
}
