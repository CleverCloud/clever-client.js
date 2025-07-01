/**
 * @import { ListInstanceCommandInput, ListInstanceCommandOutput } from './list-instance-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
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
        .append('since', normalizeDate(params.since))
        .append('until', normalizeDate(params.until))
        .append('includeState', params.includeState)
        .append('excludeState', params.excludeState)
        .append('deploymentId', params.deploymentId)
        .append('limit', params.limit)
        .append('order', params.order),
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
