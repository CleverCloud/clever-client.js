import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetCreditsSummaryCommandInput,
  GetCreditsSummaryCommandOutput,
} from './get-credits-summary-command.types.js';

/**
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
}
