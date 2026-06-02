/**
 * @import { DeleteTokenCommandInput } from './delete-oauth-token-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * Deletes an Oauth token.
 *
 * This command is for internal use only.
 *
 * @extends {CcApiSimpleCommand<DeleteTokenCommandInput, void>}
 * @endpoint [DELETE] /v2/self/tokens
 * @group Token
 * @version 2
 */
export class DeleteOauthTokenCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteTokenCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(`/v2/self/tokens/${params.token}`);
  }

  /** @type {CcApiSimpleCommand<DeleteTokenCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
