/**
 * @import { GetProductAddonVersionsCommandInput, GetProductAddonVersionsCommandOutput } from './get-product-addon-versions-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetProductAddonVersionsCommandInput, GetProductAddonVersionsCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/:XXX
 * @group Product
 * @version 4
 */
export class GetProductAddonVersionsCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetProductAddonVersionsCommandInput, GetProductAddonVersionsCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/:XXX`);
  }

  /** @type {CcApiSimpleCommand<GetProductAddonVersionsCommandInput, GetProductAddonVersionsCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
