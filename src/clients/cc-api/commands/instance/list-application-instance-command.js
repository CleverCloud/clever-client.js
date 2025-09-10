/**
 * @import { ListApplicationInstanceCommandInput, ListApplicationInstanceCommandOutput } from './list-application-instance-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformApplicationInstance } from './instance-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListApplicationInstanceCommandInput, ListApplicationInstanceCommandOutput>}
 * @endpoint [GET] /v4/orchestration/organisations/:XXX/applications/:XXX/instances
 * @group Instance
 * @version 4
 */
export class ListApplicationInstanceCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListApplicationInstanceCommandInput, ListApplicationInstanceCommandOutput>['toRequestParams']} */
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

  /** @type {CcApiSimpleCommand<ListApplicationInstanceCommandInput, ListApplicationInstanceCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformApplicationInstance), 'creationDate', 'index');
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
