import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  ListProductRuntimeCommandInput,
  ListProductRuntimeCommandOutput,
} from './list-product-runtime-command.types.js';
import { transformProductRuntime } from './product-transform.js';

/**
 * @endpoint [GET] /v2/products/instances
 * @group Product
 * @version 2
 */
export class ListProductRuntimeCommand extends CcApiSimpleCommand<
  ListProductRuntimeCommandInput,
  ListProductRuntimeCommandOutput
> {
  toRequestParams(params: ListProductRuntimeCommandInput) {
    let queryParams: QueryParams = null;
    if (params != null && typeof params === 'object') {
      queryParams = new QueryParams().append('for', params.ownerId);
    }

    return get(`/v2/products/instances`, queryParams);
  }

  transformCommandOutput(response: unknown): ListProductRuntimeCommandOutput {
    return sortBy((response as Array<unknown>).map(transformProductRuntime), 'name');
  }
}
