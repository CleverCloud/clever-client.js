import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * Deletes all Oauth tokens.
 *
 * This command is for internal use only.
 *
 * @endpoint [DELETE] /v2/self/tokens
 * @group Token
 * @version 2
 */
export class DeleteOauthTokenCommand extends CcApiSimpleCommand<void, undefined> {
  toRequestParams() {
    return delete_(`/v2/self/tokens/`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
