import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformCredits } from './credits-transform.js';
import type {
  GetCreditsSummaryCommandInput,
  GetCreditsSummaryCommandOutput,
} from './get-credits-summary-command.types.js';

/**
 * Retrieves how much prepaid and free credit an organisation has left.
 *
 * @endpoint [GET] /v4/billing/organisations/:XXX/credits/summary
 * @group Credits
 * @version 4
 */
export class GetCreditsSummaryCommand extends CcApiSimpleCommand<
  GetCreditsSummaryCommandInput,
  GetCreditsSummaryCommandOutput
> {
  toRequestParams(params: GetCreditsSummaryCommandInput) {
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/credits/summary`);
  }

  transformCommandOutput(response: unknown): GetCreditsSummaryCommandOutput {
    return transformCredits(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
