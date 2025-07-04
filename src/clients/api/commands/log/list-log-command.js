/**
 * @import { ListLogCommandInput, ListLogCommandOutput } from './list-log-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListLogCommandInput, ListLogCommandOutput>}
 * @endpoint [GET] /v2/logs/:XXX
 * @group Log
 * @version 2
 */
export class ListLogCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListLogCommandInput, ListLogCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
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

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<ListLogCommandInput, ListLogCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(
      /** @param {any} rawLog */ (rawLog) => ({
        id: rawLog._id,
        date: rawLog._source['@timestamp'],
        message: rawLog._source.message,
        type: rawLog._source.type,
        severity: rawLog._source.syslog_severity,
        program: rawLog._source.syslog_program,
        deploymentId: rawLog._source.deploymentId,
        sourceHost: rawLog._source.host,
        sourceIp: rawLog._source['@source'],
        zone: rawLog._source.zone,
      }),
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'ADDON_ID',
    };
  }
}
