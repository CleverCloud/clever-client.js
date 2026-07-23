import { QueryParams } from '../../../../lib/request/query-params.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { AbstractLogsStreamCommand } from './abstract-logs-stream-command.js';
import { transformAddonRuntimeLog } from './log-transform.js';
import type { AddonRuntimeLog } from './log.types.js';
import type { StreamAddonRuntimeLogCommandInput } from './stream-addon-runtime-log-command.types.js';

/**
 * Opens a Server-Sent Events stream of the runtime logs of an add-on.
 *
 * The stream stays open and keeps delivering lines as the add-on writes them, unless `until` closes the range
 * or `limit` caps the number of lines. Past lines are replayed first when `since` reaches into the past.
 *
 * @endpoint [GET] /v4/logs/organisations/:XXX/resources/:XXX/logs
 * @group Log
 * @version 4
 */
export class StreamAddonRuntimeLogCommand extends AbstractLogsStreamCommand<
  StreamAddonRuntimeLogCommandInput,
  AddonRuntimeLog
> {
  toRequestParams(params: StreamAddonRuntimeLogCommandInput): Partial<CcRequestParams> {
    return {
      url: safeUrl`/v4/logs/organisations/${params.ownerId}/resources/${params.addonId}/logs`,
      queryParams: new QueryParams()
        .append('limit', this._computeLimit())
        .append('since', normalizeDate(params.since))
        .append('until', normalizeDate(params.until))
        .append('deploymentId', params.deploymentId)
        .append('filter', params.filter)
        .append('instanceId', params.instanceId)
        .append('field', params.fields)
        .append('throttleElements', params.throttleElements)
        .append('throttlePerInMilliseconds', params.throttlePerInMilliseconds),
    };
  }

  _logTopicName(): string {
    return 'RESOURCE_LOG';
  }

  _convertLog(rawLog: unknown): AddonRuntimeLog {
    return transformAddonRuntimeLog(rawLog);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
