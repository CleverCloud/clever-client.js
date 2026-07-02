import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ResetGrafanaCommandInput } from './reset-grafana-command.types.js';

/**
 * @endpoint [POST] /v4/saas/grafana/:XXX/reset
 * @group Grafana
 * @version 4
 */
export class ResetGrafanaCommand extends CcApiSimpleCommand<ResetGrafanaCommandInput, undefined> {
  toRequestParams(params: ResetGrafanaCommandInput) {
    return post(safeUrl`/v4/saas/grafana/${params.ownerId}/reset`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
