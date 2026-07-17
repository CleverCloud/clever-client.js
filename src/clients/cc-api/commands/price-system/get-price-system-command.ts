import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetPriceSystemCommandInput, GetPriceSystemCommandOutput } from './get-price-system-command.types.js';
import { transformPriceSystem } from './price-system-transform.js';

/**
 * Gets the price system for the given organisation, or the public price system when `ownerId` is
 * omitted (used e.g. by an anonymous pricing simulator).
 *
 * @endpoint [GET] /v4/billing/organisations/:XXX/price-system
 * @endpoint [GET] /v4/billing/price-system
 * @group PriceSystem
 * @version 4
 */
export class GetPriceSystemCommand extends CcApiSimpleCommand<GetPriceSystemCommandInput, GetPriceSystemCommandOutput> {
  toRequestParams(params: GetPriceSystemCommandInput) {
    if (params.ownerId == null) {
      return get(
        safeUrl`/v4/billing/price-system`,
        new QueryParams().set('zone_id', params.zone).set('currency', params.currency),
      );
    }

    return get(
      safeUrl`/v4/billing/organisations/${params.ownerId}/price-system`,
      new QueryParams().set('zone_id', params.zone),
    );
  }

  transformCommandOutput(response: unknown): GetPriceSystemCommandOutput {
    return transformPriceSystem(response);
  }
}
