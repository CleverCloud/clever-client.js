import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetHeptapodPriceEstimationCommandInput,
  GetHeptapodPriceEstimationCommandOutput,
} from './get-heptapod-price-estimation-command.types.js';
import { transformHeptapodPriceEstimation } from './heptapod-price-estimation-transform.js';

/**
 * Estimates what the owner's Heptapod usage will cost over the current billing period.
 *
 * Heptapod is billed on active users and storage, so the estimate is derived from the usage
 * recorded so far.
 *
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

  transformCommandOutput(response: unknown): GetHeptapodPriceEstimationCommandOutput {
    return transformHeptapodPriceEstimation(response);
  }

  // the estimate is computed from the recorded usage on every call, nothing is invoiced or stored
  isIdempotent(): boolean {
    return true;
  }
}
