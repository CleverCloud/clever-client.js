import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetHeptapodPriceEstimationCommandInput,
  GetHeptapodPriceEstimationCommandOutput,
} from './get-heptapod-price-estimation-command.types.js';
import { transformHeptapodPriceEstimation } from './heptapod-price-estimation-transform.js';

/**
 * @endpoint [GET] /v2/saas/heptapod/:XXX/heptapod.host/price-prevision
 * @group Heptapod
 * @version 2
 */
export class GetHeptapodPriceEstimationCommand extends CcApiSimpleCommand<
  GetHeptapodPriceEstimationCommandInput,
  GetHeptapodPriceEstimationCommandOutput
> {
  toRequestParams(params: GetHeptapodPriceEstimationCommandInput) {
    return get(safeUrl`/v2/saas/heptapod/${params.ownerId}/heptapod.host/price-prevision`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetHeptapodPriceEstimationCommandOutput {
    return transformHeptapodPriceEstimation(response);
  }
}
