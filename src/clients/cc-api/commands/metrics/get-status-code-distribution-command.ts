import { QueryParams } from '../../../../lib/request/query-params.ts';
import { get } from '../../../../lib/request/request-params-builder.ts';
import { normalizeDate, safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  GetStatusCodeDistributionCommandInput,
  GetStatusCodeDistributionCommandOutput,
} from './get-status-code-distribution-command.types.ts';
import { transformStatusCodeDistribution } from './metrics-transform.ts';

/**
 * Gets the distribution of HTTP status codes over time for an owner, optionally restricted to a single application.
 *
 * The backend counts the responses served by the platform's load balancers into hourly buckets; the client
 * additionally sums them over the whole range into `byStatusCode`.
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

  isIdempotent(): boolean {
    return true;
  }
}
