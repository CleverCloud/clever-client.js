import { QueryParams } from '../../../../lib/request/query-params.ts';
import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  GetProductRuntimeCommandInput,
  GetProductRuntimeCommandOutput,
} from './get-product-runtime-command.types.ts';
import { transformProductRuntime } from './product-transform.ts';

/**
 * Retrieves one runtime from the product catalogue.
 *
 * Passing an owner narrows the scaler sizes and prices down to what that organisation is entitled
 * to.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}
