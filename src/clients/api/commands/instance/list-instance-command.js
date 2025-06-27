/**
 * @import { ListInstanceCommandInput, ListInstanceCommandOutput } from './list-instance-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListInstanceCommandInput, ListInstanceCommandOutput>}
 * @endpoint [GET] /v4/orchestration/organisations/:XXX/applications/:XXX/instances
 * @group Instance
 * @version 4
 */
export class ListInstanceCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListInstanceCommandInput, ListInstanceCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances`,
      new QueryParams()
        .setParams(omit(params, 'ownerId', 'applicationId', 'since', 'until'))
        .set('since', normalizeDate(params.since))
        .set('until', normalizeDate(params.until)),
    );
  }

  /** @type {CcApiSimpleCommand<ListInstanceCommandInput, ListInstanceCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<ListInstanceCommandInput, ListInstanceCommandOutput>['getEmptyResponse']} */
  getEmptyResponse() {
    return [];
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
