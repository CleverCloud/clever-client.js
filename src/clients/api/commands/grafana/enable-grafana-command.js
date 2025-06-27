/**
 * @import { EnableGrafanaCommandInput, EnableGrafanaCommandOutput } from './enable-grafana-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { GetGrafanaCommand } from './get-grafana-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<EnableGrafanaCommandInput, EnableGrafanaCommandOutput>}
 * @endpoint [POST] /v4/saas/grafana/:XXX
 * @endpoint [GET] /v4/saas/grafana/:XXX
 * @group Grafana
 * @version 4
 */
export class EnableGrafanaCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<EnableGrafanaCommandInput, EnableGrafanaCommandOutput>['compose']} */
  async compose(params, composer) {
    await composer.send(new InnerEnableGrafanaCommand(params));
    return composer.send(new GetGrafanaCommand(params));
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<EnableGrafanaCommandInput, void>}
 * @endpoint [POST] /v4/saas/grafana/:XXX
 * @group Grafana
 * @version 4
 */
class InnerEnableGrafanaCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<EnableGrafanaCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/saas/grafana/${params.ownerId}`);
  }
}
