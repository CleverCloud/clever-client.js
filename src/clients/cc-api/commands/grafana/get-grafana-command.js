/**
 * @import { GetGrafanaCommandInput, GetGrafanaCommandOutput } from './get-grafana-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetGrafanaCommandInput, GetGrafanaCommandOutput>}
 * @endpoint [GET] /v4/saas/grafana/:XXX
 * @group Grafana
 * @version 4
 */
export class GetGrafanaCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetGrafanaCommandInput, GetGrafanaCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/saas/grafana/${params.ownerId}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
