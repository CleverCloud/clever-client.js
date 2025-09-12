/**
 * @import { StreamApplicationRuntimeLogCommandInput } from './stream-application-runtime-log-command.types.js'
 * @import { ApplicationRuntimeLog } from './log.types.js'
 */

import { QueryParams } from '../../../../lib/request/query-params.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { AbstractLogsStreamCommand } from './abstract-logs-stream-command.js';

/**
 * @extends {AbstractLogsStreamCommand<StreamApplicationRuntimeLogCommandInput, ApplicationRuntimeLog>}
 * @endpoint [GET] /v4/logs/organisations/:XXX/applications/:XXX/logs
 * @group Log
 * @version 4
 */
export class StreamApplicationRuntimeLogCommand extends AbstractLogsStreamCommand {
  /** @type {AbstractLogsStreamCommand<StreamApplicationRuntimeLogCommandInput, ApplicationRuntimeLog>['toRequestParams']} */
  toRequestParams(params) {
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

  /** @type {AbstractLogsStreamCommand<StreamApplicationRuntimeLogCommandInput, ApplicationRuntimeLog>['_logTopicName']} */
  _logTopicName() {
    return 'APPLICATION_LOG';
  }

  /** @type {AbstractLogsStreamCommand<StreamApplicationRuntimeLogCommandInput, ApplicationRuntimeLog>['_convertLog']} */
  _convertLog(rawLog) {
    return {
      id: rawLog.id,
      applicationId: rawLog.applicationId,
      commitId: rawLog.commitId,
      deploymentId: rawLog.deploymentId,
      instanceId: rawLog.instanceId,
      date: normalizeDate(rawLog.date),
      zone: rawLog.zone,
      pid: rawLog.pid,
      facility: rawLog.facility,
      severity: rawLog.severity,
      priority: rawLog.priority,
      version: rawLog.version,
      service: rawLog.service,
      message: rawLog.message,
    };
  }

  /** @type {AbstractLogsStreamCommand<StreamApplicationRuntimeLogCommandInput, ApplicationRuntimeLog>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
