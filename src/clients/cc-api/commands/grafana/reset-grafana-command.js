/**
 * @import { ResetGrafanaCommandInput } from './reset-grafana-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ResetGrafanaCommandInput, void>}
 * @endpoint [POST] /v4/saas/grafana/:XXX/reset
 * @group Grafana
 * @version 4
 */
export class ResetGrafanaCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ResetGrafanaCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/saas/grafana/${params.ownerId}/reset`);
  }

  /** @type {CcApiSimpleCommand<ResetGrafanaCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
