import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { EnableGrafanaCommandInput, EnableGrafanaCommandOutput } from './enable-grafana-command.types.js';
import { GetGrafanaCommand } from './get-grafana-command.js';

/**
 * @endpoint [POST] /v4/saas/grafana/:XXX
 * @endpoint [GET] /v4/saas/grafana/:XXX
 * @group Grafana
 * @version 4
 */
export class EnableGrafanaCommand extends CcApiCompositeCommand<EnableGrafanaCommandInput, EnableGrafanaCommandOutput> {
  async compose(params: EnableGrafanaCommandInput, composer: CcApiComposer): Promise<EnableGrafanaCommandOutput> {
    await composer.send(new InnerEnableGrafanaCommand(params));
    return composer.send(new GetGrafanaCommand(params));
  }
}

/**
 * @endpoint [POST] /v4/saas/grafana/:XXX
 * @group Grafana
 * @version 4
 */
class InnerEnableGrafanaCommand extends CcApiSimpleCommand<EnableGrafanaCommandInput, void> {
  toRequestParams(params: EnableGrafanaCommandInput) {
    return post(safeUrl`/v4/saas/grafana/${params.ownerId}`);
  }
}
