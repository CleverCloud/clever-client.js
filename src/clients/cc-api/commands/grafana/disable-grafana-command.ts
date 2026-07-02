import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DisableGrafanaCommandInput } from './disable-grafana-command.types.js';

/**
 * @endpoint [DELETE] /v4/saas/grafana/:XXX
 * @group Grafana
 * @version 4
 */
export class DisableGrafanaCommand extends CcApiSimpleCommand<DisableGrafanaCommandInput, undefined> {
  toRequestParams(params: DisableGrafanaCommandInput) {
    return delete_(safeUrl`/v4/saas/grafana/${params.ownerId}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
