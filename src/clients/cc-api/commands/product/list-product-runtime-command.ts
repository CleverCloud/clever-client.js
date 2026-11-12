import { QueryParams } from '../../../../lib/request/query-params.ts';
import { get } from '../../../../lib/request/request-params-builder.ts';
import { sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  ListProductRuntimeCommandInput,
  ListProductRuntimeCommandOutput,
} from './list-product-runtime-command.types.ts';
import { transformProductRuntime } from './product-transform.ts';

/**
 * Lists the runtimes applications can be deployed on.
 *
 * Passing an owner narrows the catalogue down to what that organisation is entitled to.
 *
 * @endpoint [GET] /v2/products/instances
 * @group Product
 * @version 2
 */
export class ListProductRuntimeCommand extends CcApiSimpleCommand<
  ListProductRuntimeCommandInput,
  ListProductRuntimeCommandOutput
> {
  toRequestParams(params: ListProductRuntimeCommandInput) {
    let queryParams: QueryParams | undefined;
    if (params != null && typeof params === 'object') {
      queryParams = new QueryParams().append('for', params.ownerId);
    }

    return get(`/v2/products/instances`, queryParams);
  }

  transformCommandOutput(response: unknown): ListProductRuntimeCommandOutput {
    return sortBy((response as Array<unknown>).map(transformProductRuntime), 'name');
  }

  isIdempotent(): boolean {
    return true;
  }
}
