import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformApplicationInstance } from './instance-transform.js';
import type {
  ListApplicationInstanceCommandInput,
  ListApplicationInstanceCommandOutput,
} from './list-application-instance-command.types.js';

/**
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
    return sortBy((response as Array<unknown>).map(transformApplicationInstance), 'creationDate', 'index');
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
