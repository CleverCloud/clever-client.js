/**
 * @import { GetProductElasticsearchInfoCommandOutput } from './get-product-elasticsearch-info-command.types.js';
 * @import { ElasticsearchServiceInfo } from './product.types.js';
 */

import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * @extends {CcApiSimpleCommand<void, GetProductElasticsearchInfoCommandOutput>}
 * @endpoint [GET] /v2/providers/es-addon/tmp/services-flavors
 * @group Product
 * @version 2
 */
export class GetProductElasticsearchInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, GetProductElasticsearchInfoCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/v2/providers/es-addon/tmp/services-flavors`);
  }

  /** @type {CcApiSimpleCommand<void, GetProductElasticsearchInfoCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      services: {
        apm: transformServiceInfo(response.services.apm),
        kibana: transformServiceInfo(response.services.kibana),
      },
    };
  }
}

/**
 *
 * @param {any} payload
 * @returns {ElasticsearchServiceInfo}
 */
function transformServiceInfo(payload) {
  return {
    name: payload.name,
    mem: payload.mem,
    cpus: payload.cpus,
    gpus: payload.gpus,
    price: payload.price,
    available: payload.available,
    microservice: payload.microservice,
    nice: payload.nice,
    priceId: payload.price_id.toLowerCase(),
  };
}
