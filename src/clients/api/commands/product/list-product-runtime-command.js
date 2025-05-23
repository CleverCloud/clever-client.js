/**
 * @import { ListProductRuntimeCommandOutput } from './list-product-runtime-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformProductRuntime } from './product-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, ListProductRuntimeCommandOutput>}
 * @endpoint [GET] /v2/products/instances
 * @group Product
 * @version 2
 */
export class ListProductRuntimeCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, ListProductRuntimeCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/v2/products/instances`);
  }

  /** @type {CcApiSimpleCommand<void, ListProductRuntimeCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(transformProductRuntime);
  }
}
