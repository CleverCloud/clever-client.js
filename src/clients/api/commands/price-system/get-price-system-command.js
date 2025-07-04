/**
 * @import { GetPriceSystemCommandInput, GetPriceSystemCommandOutput } from './get-price-system-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformPriceSystem } from './price-system-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetPriceSystemCommandInput, GetPriceSystemCommandOutput>}
 * @endpoint [GET] /v4/billing/organisations/:XXX/price-system
 * @group PriceSystem
 * @version 4
 */
export class GetPriceSystemCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetPriceSystemCommandInput, GetPriceSystemCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/billing/organisations/${params.ownerId}/price-system`,
      new QueryParams().set('zone_id', params.zone),
    );
  }

  /** @type {CcApiSimpleCommand<GetPriceSystemCommandInput, GetPriceSystemCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformPriceSystem(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
