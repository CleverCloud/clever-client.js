/**
 * @import { ListTokenCommandOutput } from './list-token-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, ListTokenCommandOutput>}
 * @endpoint [GET] /v2/self/tokens
 * @group Token
 * @version 2
 */
export class ListTokenCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, ListTokenCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(`/v2/self/tokens`);
  }

  /** @type {CcApiSimpleCommand<void, ListTokenCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
