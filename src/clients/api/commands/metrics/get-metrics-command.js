/**
 * @import { GetMetricsCommandInput, GetMetricsCommandOutput } from './get-metrics-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetMetricsCommandInput, GetMetricsCommandOutput>}
 * @endpoint [GET] /v4/stats/organisations/:XXX/resources/:XXX/metrics
 * @group Metrics
 * @version 4
 */
export class GetMetricsCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetMetricsCommandInput, GetMetricsCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/stats/organisations/:XXX/resources/:XXX/metrics`);
  }

  /** @type {CcApiSimpleCommand<GetMetricsCommandInput, GetMetricsCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
