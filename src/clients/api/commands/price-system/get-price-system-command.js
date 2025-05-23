/**
 * @import { GetPriceSystemCommandInput, GetPriceSystemCommandOutput } from './get-price-system-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

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
    return get(safeUrl`/v4/billing/organisations/:XXX/price-system`);
  }

  /** @type {CcApiSimpleCommand<GetPriceSystemCommandInput, GetPriceSystemCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
