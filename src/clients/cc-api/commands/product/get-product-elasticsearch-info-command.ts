import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetProductElasticsearchInfoCommandOutput } from './get-product-elasticsearch-info-command.types.js';
import { transformProductElasticsearchInfo } from './product-transform.js';

/**
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
}
