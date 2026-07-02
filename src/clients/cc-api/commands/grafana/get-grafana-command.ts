import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetGrafanaCommandInput, GetGrafanaCommandOutput } from './get-grafana-command.types.js';

/**
 * @endpoint [GET] /v4/saas/grafana/:XXX
 * @group Grafana
 * @version 4
 */
export class GetGrafanaCommand extends CcApiSimpleCommand<GetGrafanaCommandInput, GetGrafanaCommandOutput> {
  toRequestParams(params: GetGrafanaCommandInput) {
    return get(safeUrl`/v4/saas/grafana/${params.ownerId}`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
