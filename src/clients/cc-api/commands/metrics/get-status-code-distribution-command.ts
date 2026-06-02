import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetStatusCodeDistributionCommandInput,
  GetStatusCodeDistributionCommandOutput,
} from './get-status-code-distribution-command.types.js';
import { transformStatusCodeDistribution } from './metrics-transform.js';

/**
 * Gets the distribution of HTTP status codes over time for an owner, optionally restricted to a single application.
 *
 * @endpoint [GET] /v4/stats/organisations/:XXX/http-status-codes
 * @group Metrics
 * @version 4
 */
export class GetStatusCodeDistributionCommand extends CcApiSimpleCommand<
  GetStatusCodeDistributionCommandInput,
  GetStatusCodeDistributionCommandOutput
> {
  toRequestParams(params: GetStatusCodeDistributionCommandInput) {
    return get(
      safeUrl`/v4/stats/organisations/${params.ownerId}/http-status-codes`,
      new QueryParams()
        .set('applicationId', params.applicationId)
        .set('from', normalizeDate(params.from))
        .set('to', normalizeDate(params.to)),
    );
  }

  transformCommandOutput(response: unknown): GetStatusCodeDistributionCommandOutput {
    return transformStatusCodeDistribution(response, this.params.excludeNonStandardStatusCodes === true);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
