/**
 * @import { ListProductRuntimeCommandInput, ListProductRuntimeCommandOutput } from './list-product-runtime-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformProductRuntime } from './product-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListProductRuntimeCommandInput, ListProductRuntimeCommandOutput>}
 * @endpoint [GET] /v2/products/instances
 * @group Product
 * @version 2
 */
export class ListProductRuntimeCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListProductRuntimeCommandInput, ListProductRuntimeCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    /** @type {QueryParams} */
    let queryParams = null;
    if (params != null && typeof params === 'object') {
      queryParams = new QueryParams().append('for', params.ownerId);
    }

    return get(`/v2/products/instances`, queryParams);
  }

  /** @type {CcApiSimpleCommand<void, ListProductRuntimeCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformProductRuntime), 'name');
  }
}
