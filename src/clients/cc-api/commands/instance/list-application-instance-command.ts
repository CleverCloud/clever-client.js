import { QueryParams } from '../../../../lib/request/query-params.ts';
import { get } from '../../../../lib/request/request-params-builder.ts';
import { normalizeDate, safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformApplicationInstance } from './instance-transform.ts';
import type {
  ListApplicationInstanceCommandInput,
  ListApplicationInstanceCommandOutput,
} from './list-application-instance-command.types.ts';

/**
 * Lists the instances of an application, live and destroyed alike.
 *
 * Without any filter the whole history is returned, so a long-lived application yields the instances of all its
 * past deployments. Narrow it down with `deploymentId`, a time range or a state filter.
 *
 * @endpoint [GET] /v4/orchestration/organisations/:XXX/applications/:XXX/instances
 * @group Instance
 * @version 4
 */
export class ListApplicationInstanceCommand extends CcApiSimpleCommand<
  ListApplicationInstanceCommandInput,
  ListApplicationInstanceCommandOutput
> {
  toRequestParams(params: ListApplicationInstanceCommandInput) {
    return get(
      safeUrl`/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances`,
      new QueryParams()
        .append('since', normalizeDate(params.since))
        .append('until', normalizeDate(params.until))
        .append('includeState', params.includeState)
        .append('excludeState', params.excludeState)
        .append('deploymentId', params.deploymentId)
        .append('limit', params.limit)
        .append('order', params.order),
    );
  }

  transformCommandOutput(response: unknown): ListApplicationInstanceCommandOutput {
    return sortBy((response as Array<unknown>).map(transformApplicationInstance), 'createdAt', 'index');
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
