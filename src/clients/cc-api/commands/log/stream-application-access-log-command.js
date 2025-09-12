/**
 * @import { StreamApplicationAccessLogCommandInput } from './stream-application-access-log-command.types.js'
 * @import { ApplicationAccessLog, ApplicationAccessLogBase, ApplicationAccessLogHttpDetail } from './log.types.js'
 */

import { QueryParams } from '../../../../lib/request/query-params.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { AbstractLogsStreamCommand } from './abstract-logs-stream-command.js';

/**
 * @extends {AbstractLogsStreamCommand<StreamApplicationAccessLogCommandInput, ApplicationAccessLog>}
 * @endpoint [GET] /v4/accesslogs/organisations/:XXX/applications/:XXX/accesslogs
 * @group Log
 * @version 4
 */
export class StreamApplicationAccessLogCommand extends AbstractLogsStreamCommand {
  /** @type {AbstractLogsStreamCommand<StreamApplicationAccessLogCommandInput, ApplicationAccessLog>['toRequestParams']} */
  toRequestParams(params) {
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

  /** @type {AbstractLogsStreamCommand<StreamApplicationAccessLogCommandInput, ApplicationAccessLog>['_logTopicName']} */
  _logTopicName() {
    return 'ACCESS_LOG';
  }

  /** @type {AbstractLogsStreamCommand<StreamApplicationAccessLogCommandInput, ApplicationAccessLog>['_convertLog']} */
  _convertLog(payload) {
    if (payload.http != null) {
      return {
        ...convertBaseAccessLog(payload),
        type: 'http',
        detail: convertHttpDetail(payload.http),
      };
    }
    // todo: handle TCP and SSH access logs.
    return null;
  }

  /** @type {AbstractLogsStreamCommand<StreamApplicationAccessLogCommandInput, ApplicationAccessLog>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}

/**
 * @param {any} payload
 * @returns {Omit<ApplicationAccessLogBase<?>, 'detail'>}
 */
function convertBaseAccessLog(payload) {
  return {
    id: payload.id,
    date: normalizeDate(payload.date),
    applicationId: payload.applicationId,
    instanceId: payload.instanceId,
    requestId: payload.requestId,
    bytesIn: payload.bytesIn,
    bytesOut: payload.bytesOut,
    source: payload.source,
    destination: payload.destination,
    tls: payload.tls,
    zone: payload.zone,
  };
}

/**
 * @param {any} payload
 * @returns {ApplicationAccessLogHttpDetail}
 */
function convertHttpDetail(payload) {
  return {
    request: payload.request,
    response: {
      statusCode: payload.response.statusCode,
      time: payload.response.time,
    },
  };
}
