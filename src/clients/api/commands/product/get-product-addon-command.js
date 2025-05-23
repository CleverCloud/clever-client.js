/**
 * @import { GetProductAddonCommandInput, GetProductAddonCommandOutput } from './get-product-addon-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetProductAddonCommandInput, GetProductAddonCommandOutput>}
 * @endpoint [GET] /v2/products/addonproviders/:XXX
 * @group Product
 * @version 2
 */
export class GetProductAddonCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetProductAddonCommandInput, GetProductAddonCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/products/addonproviders/:XXX`);
  }

  /** @type {CcApiSimpleCommand<GetProductAddonCommandInput, GetProductAddonCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
