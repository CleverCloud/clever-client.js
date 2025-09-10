/**
 * @import { GetHeptapodPriceEstimationCommandInput, GetHeptapodPriceEstimationCommandOutput } from './get-heptapod-price-estimation-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetHeptapodPriceEstimationCommandInput, GetHeptapodPriceEstimationCommandOutput>}
 * @endpoint [GET] /v2/saas/heptapod/:XXX/heptapod.host/price-prevision
 * @group Heptapod
 * @version 2
 */
export class GetHeptapodPriceEstimationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetHeptapodPriceEstimationCommandInput, GetHeptapodPriceEstimationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/saas/heptapod/${params.ownerId}/heptapod.host/price-prevision`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetHeptapodPriceEstimationCommandInput, GetHeptapodPriceEstimationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      publicActiveUsers: response.public_active_users,
      privateActiveUsers: response.private_active_users,
      storage: response.storage,
      price: response.price,
    };
  }
}
