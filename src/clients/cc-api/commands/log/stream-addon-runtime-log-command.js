/**
 * @import { StreamAddonRuntimeLogCommandInput } from './stream-addon-runtime-log-command.types.js'
 * @import { AddonRuntimeLog } from './log.types.js'
 */

import { QueryParams } from '../../../../lib/request/query-params.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { AbstractLogsStreamCommand } from './abstract-logs-stream-command.js';

/**
 * @extends {AbstractLogsStreamCommand<StreamAddonRuntimeLogCommandInput, AddonRuntimeLog>}
 * @endpoint [GET] /v4/logs/organisations/:XXX/resources/:XXX/logs
 * @group Log
 * @version 4
 */
export class StreamAddonRuntimeLogCommand extends AbstractLogsStreamCommand {
  /** @type {AbstractLogsStreamCommand<StreamAddonRuntimeLogCommandInput, AddonRuntimeLog>['toRequestParams']} */
  toRequestParams(params) {
    return {
      url: safeUrl`/v4/logs/organisations/${params.ownerId}/resources/${params.addonId}/logs`,
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

  /** @type {AbstractLogsStreamCommand<StreamAddonRuntimeLogCommandInput, AddonRuntimeLog>['_logTopicName']} */
  _logTopicName() {
    return 'RESOURCE_LOG';
  }

  /** @type {AbstractLogsStreamCommand<StreamAddonRuntimeLogCommandInput, AddonRuntimeLog>['_convertLog']} */
  _convertLog(rawLog) {
    return {
      id: rawLog.id,
      addonId: rawLog.resourceId,
      hostname: rawLog.hostname,
      instanceId: rawLog.instanceId,
      date: normalizeDate(rawLog.date),
      zone: rawLog.zone,
      pid: rawLog.pid,
      facility: rawLog.facility,
      severity: rawLog.severity,
      service: rawLog.service,
      message: rawLog.message,
    };
  }

  /** @type {AbstractLogsStreamCommand<StreamAddonRuntimeLogCommandInput, AddonRuntimeLog>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
