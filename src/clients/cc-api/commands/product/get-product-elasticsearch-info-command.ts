import { get } from '../../../../lib/request/request-params-builder.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { GetProductElasticsearchInfoCommandOutput } from './get-product-elasticsearch-info-command.types.ts';
import { transformProductElasticsearchInfo } from './product-transform.ts';

/**
 * Retrieves the scaler sizes the services shipped alongside an Elasticsearch add-on run on.
 *
 * The endpoint is marked as temporary on the backend, so it may move.
 *
 * @endpoint [GET] /v2/providers/es-addon/tmp/services-flavors
 * @group Product
 * @version 2
 */
export class GetProductElasticsearchInfoCommand extends CcApiSimpleCommand<
  void,
  GetProductElasticsearchInfoCommandOutput
> {
  toRequestParams() {
    return get(`/v2/providers/es-addon/tmp/services-flavors`);
  }

  transformCommandOutput(response: unknown): GetProductElasticsearchInfoCommandOutput {
    return transformProductElasticsearchInfo(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
