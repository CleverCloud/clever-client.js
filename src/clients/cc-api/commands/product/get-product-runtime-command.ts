import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetProductRuntimeCommandInput,
  GetProductRuntimeCommandOutput,
} from './get-product-runtime-command.types.js';
import { transformProductRuntime } from './product-transform.js';

/**
 * @endpoint [GET] /v2/products/instances/:XXX-:XXX
 * @group Product
 * @version 2
 */
export class GetProductRuntimeCommand extends CcApiSimpleCommand<
  GetProductRuntimeCommandInput,
  GetProductRuntimeCommandOutput
> {
  toRequestParams(params: GetProductRuntimeCommandInput) {
    return get(
      safeUrl`/v2/products/instances/${params.type}-${params.version}`,
      new QueryParams().append('for', params.ownerId),
    );
  }

  transformCommandOutput(response: unknown): GetProductRuntimeCommandOutput {
    return transformProductRuntime(response);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
