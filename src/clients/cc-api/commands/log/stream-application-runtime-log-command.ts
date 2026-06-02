import { QueryParams } from '../../../../lib/request/query-params.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { AbstractLogsStreamCommand } from './abstract-logs-stream-command.js';
import { transformApplicationRuntimeLog } from './log-transform.js';
import type { ApplicationRuntimeLog } from './log.types.js';
import type { StreamApplicationRuntimeLogCommandInput } from './stream-application-runtime-log-command.types.js';

/**
 * @endpoint [GET] /v4/logs/organisations/:XXX/applications/:XXX/logs
 * @group Log
 * @version 4
 */
export class StreamApplicationRuntimeLogCommand extends AbstractLogsStreamCommand<
  StreamApplicationRuntimeLogCommandInput,
  ApplicationRuntimeLog
> {
  toRequestParams(params: StreamApplicationRuntimeLogCommandInput): Partial<CcRequestParams> {
    return {
      url: safeUrl`/v4/logs/organisations/${params.ownerId}/applications/${params.applicationId}/logs`,
      queryParams: new QueryParams()
        .append('limit', this._computeLimit())
        .append('since', normalizeDate(params.since))
        .append('until', normalizeDate(params.until))
        .append('deploymentId', params.deploymentId)
        .append('filter', params.filter)
        .append('instanceId', params.instanceId)
        .append('field', params.field)
        .append('throttleElements', params.throttleElements)
        .append('throttlePerInMilliseconds', params.throttlePerInMilliseconds),
    };
  }

  _logTopicName(): string {
    return 'APPLICATION_LOG';
  }

  _convertLog(rawLog: unknown): ApplicationRuntimeLog {
    return transformApplicationRuntimeLog(rawLog);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
