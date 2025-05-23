/**
 * @import { GetProductRuntimeCommandInput, GetProductRuntimeCommandOutput } from './get-product-runtime-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetProductRuntimeCommandInput, GetProductRuntimeCommandOutput>}
 * @endpoint [GET] /v2/products/instances/:XXX-:XXX
 * @group Product
 * @version 2
 */
export class GetProductRuntimeCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetProductRuntimeCommandInput, GetProductRuntimeCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/products/instances/:XXX-:XXX`);
  }

  /** @type {CcApiSimpleCommand<GetProductRuntimeCommandInput, GetProductRuntimeCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
