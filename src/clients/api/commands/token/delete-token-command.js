/**
 * @import { DeleteTokenCommandOutput } from './delete-token-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, DeleteTokenCommandOutput>}
 * @endpoint [DELETE] /v2/self/tokens
 * @group Token
 * @version 2
 */
export class DeleteTokenCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, DeleteTokenCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(`/v2/self/tokens`);
  }
}
