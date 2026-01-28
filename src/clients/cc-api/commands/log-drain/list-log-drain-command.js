/**
 * @import { ListLogDrainCommandInput, ListLogDrainCommandOutput } from './list-log-drain-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformLogDrain } from './log-drain-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListLogDrainCommandInput, ListLogDrainCommandOutput>}
 * @endpoint [GET] /v4/drains/organisations/:XXX/applications/:XXX/drains
 * @group LogDrain
 * @version 4
 */
export class ListLogDrainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListLogDrainCommandInput, ListLogDrainCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/drains/organisations/${params.ownerId}/applications/${params.applicationId}/drains`,
      new QueryParams()
        .set('status', params.status)
        .set('executionStatus', params.executionStatus)
        .set('executionStatusNotIn', params.executionStatusNotIn),
    );
  }

  /** @type {CcApiSimpleCommand<ListLogDrainCommandInput, ListLogDrainCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformLogDrain), { key: 'updatedAt', order: 'desc' });
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
