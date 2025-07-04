/**
 * @import { GetProductRuntimeCommandInput, GetProductRuntimeCommandOutput } from './get-product-runtime-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformProductRuntime } from './product-transform.js';

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
    return get(safeUrl`/v2/products/instances/${params.type}-${params.version}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetProductRuntimeCommandInput, GetProductRuntimeCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformProductRuntime(response);
  }
}
