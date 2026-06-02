/**
 * @import { GetCreditsSummaryCommandInput, GetCreditsSummaryCommandOutput } from './get-credits-summary-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetCreditsSummaryCommandInput, GetCreditsSummaryCommandOutput>}
 * @endpoint [GET] /v4/billing/organisations/:XXX/credits/summary
 * @group Credits
 * @version 4
 */
export class GetCreditsSummaryCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetCreditsSummaryCommandInput, GetCreditsSummaryCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/billing/organisations/${params.ownerId}/credits/summary`);
  }
}
