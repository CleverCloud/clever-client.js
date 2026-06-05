import { QueryParams } from '../../../../lib/request/query-params.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { AbstractLogsStreamCommand } from './abstract-logs-stream-command.js';
import { transformApplicationAccessLog } from './log-transform.js';
import type { ApplicationAccessLog } from './log.types.js';
import type { StreamApplicationAccessLogCommandInput } from './stream-application-access-log-command.types.js';

/**
 * @endpoint [GET] /v4/accesslogs/organisations/:XXX/applications/:XXX/accesslogs
 * @group Log
 * @version 4
 */
export class StreamApplicationAccessLogCommand extends AbstractLogsStreamCommand<
  StreamApplicationAccessLogCommandInput,
  ApplicationAccessLog
> {
  toRequestParams(params: StreamApplicationAccessLogCommandInput): Partial<CcRequestParams> {
    return {
      url: safeUrl`/v4/accesslogs/organisations/${params.ownerId}/applications/${params.applicationId}/accesslogs`,
      queryParams: new QueryParams()
        .append('limit', this._computeLimit())
        .append('since', normalizeDate(params.since))
        .append('until', normalizeDate(params.until))
        .append('field', params.field)
        .append('throttleElements', params.throttleElements)
        .append('throttlePerInMilliseconds', params.throttlePerInMilliseconds),
    };
  }

  _logTopicName(): string {
    return 'ACCESS_LOG';
  }

  _convertLog(payload: unknown): ApplicationAccessLog {
    return transformApplicationAccessLog(payload)!;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
