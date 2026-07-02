import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { ListLogCommandInput, ListLogCommandOutput } from './list-log-command.types.js';
import { transformOldLogs } from './log-transform.js';

/**
 * @endpoint [GET] /v2/logs/:XXX
 * @group Log
 * @version 2
 */
export class ListLogCommand extends CcApiSimpleCommand<ListLogCommandInput, ListLogCommandOutput> {
  toRequestParams(params: ListLogCommandInput) {
    return get(
      safeUrl`/v2/logs/${params.addonId}`,
      new QueryParams()
        .set('limit', params.limit)
        .set('order', params.order)
        .set('after', normalizeDate(params.since))
        .set('before', normalizeDate(params.until))
        .set('deployment_id', params.deploymentId)
        .set('filter', params.filter),
    );
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  transformCommandOutput(response: unknown): ListLogCommandOutput {
    return transformOldLogs(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'ADDON_ID',
    };
  }
}
