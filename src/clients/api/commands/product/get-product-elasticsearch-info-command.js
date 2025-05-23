/**
 * @import { GetProductElasticsearchInfoCommandOutput } from './get-product-elasticsearch-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, GetProductElasticsearchInfoCommandOutput>}
 * @endpoint [GET] /v2/providers/es-addon/tmp/services-flavors
 * @group Product
 * @version 2
 */
export class GetProductElasticsearchInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, GetProductElasticsearchInfoCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(`/v2/providers/es-addon/tmp/services-flavors`);
  }

  /** @type {CcApiSimpleCommand<void, GetProductElasticsearchInfoCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
