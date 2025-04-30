/**
 * @import { ListLogDrainCommandInput, ListLogDrainCommandOutput } from './list-log-drain-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
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

  /** @type {CcApiSimpleCommand<ListLogDrainCommandInput, ListLogDrainCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformLogDrain), { key: 'createdAt', order: 'desc' });
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'ADDON_ID',
    };
  }
}
