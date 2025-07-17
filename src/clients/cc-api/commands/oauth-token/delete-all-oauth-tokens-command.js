import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, void>}
 * @endpoint [DELETE] /v2/self/tokens
 * @group Token
 * @version 2
 */
export class DeleteOauthTokenCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, void>['toRequestParams']} */
  toRequestParams() {
    return delete_(`/v2/self/tokens/`);
  }

  /** @type {CcApiSimpleCommand<void, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
