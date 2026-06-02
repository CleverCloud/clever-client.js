/**
 * @import { DisableGrafanaCommandInput } from './disable-grafana-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DisableGrafanaCommandInput, void>}
 * @endpoint [DELETE] /v4/saas/grafana/:XXX
 * @group Grafana
 * @version 4
 */
export class DisableGrafanaCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DisableGrafanaCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v4/saas/grafana/${params.ownerId}`);
  }

  /** @type {CcApiSimpleCommand<DisableGrafanaCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
