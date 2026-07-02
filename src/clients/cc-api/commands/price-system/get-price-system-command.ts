import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetPriceSystemCommandInput, GetPriceSystemCommandOutput } from './get-price-system-command.types.js';
import { transformPriceSystem } from './price-system-transform.js';

/**
 * @endpoint [GET] /v4/billing/organisations/:XXX/price-system
 * @group PriceSystem
 * @version 4
 */
export class GetPriceSystemCommand extends CcApiSimpleCommand<GetPriceSystemCommandInput, GetPriceSystemCommandOutput> {
  toRequestParams(params: GetPriceSystemCommandInput) {
    return get(
      safeUrl`/v4/billing/organisations/${params.ownerId}/price-system`,
      new QueryParams().set('zone_id', params.zone),
    );
  }

  transformCommandOutput(response: unknown): GetPriceSystemCommandOutput {
    return transformPriceSystem(response);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
