/**
 * @import { ListLogDrainCommandInput, ListLogDrainCommandOutput } from './list-log-drain-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformLogDrain } from './log-drain-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListLogDrainCommandInput, ListLogDrainCommandOutput>}
 * @endpoint [GET] /v2/logs/:XXX/drains
 * @group LogDrain
 * @version 2
 */
export class ListLogDrainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListLogDrainCommandInput, ListLogDrainCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return get(safeUrl`/v2/logs/${resourceId}/drains`);
  }

  /** @type {CcApiSimpleCommand<ListLogDrainCommandInput, ListLogDrainCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<ListLogDrainCommandInput, ListLogDrainCommandOutput>['getEmptyResponse']} */
  getEmptyResponse() {
    return [];
  }

  /** @type {CcApiSimpleCommand<ListLogDrainCommandInput, ListLogDrainCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(transformLogDrain);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'ADDON_ID',
    };
  }
}
