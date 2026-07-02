import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { ListLogDrainCommandInput, ListLogDrainCommandOutput } from './list-log-drain-command.types.js';
import { transformLogDrain } from './log-drain-transform.js';

/**
 * @endpoint [GET] /v4/drains/organisations/:XXX/applications/:XXX/drains
 * @group LogDrain
 * @version 4
 */
export class ListLogDrainCommand extends CcApiSimpleCommand<ListLogDrainCommandInput, ListLogDrainCommandOutput> {
  toRequestParams(params: ListLogDrainCommandInput) {
    return get(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains`,
      new QueryParams()
        .set('status', params.status)
        .set('executionStatus', params.executionStatus)
        .set('executionStatusNotIn', params.executionStatusNotIn),
    );
  }

  transformCommandOutput(response: unknown): ListLogDrainCommandOutput {
    return sortBy((response as Array<Parameters<typeof transformLogDrain>[0]>).map(transformLogDrain), {
      key: 'updatedAt',
      order: 'desc',
    });
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
