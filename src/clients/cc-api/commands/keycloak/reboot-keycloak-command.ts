import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { RebootKeycloakCommandInput } from './reboot-keycloak-command.types.js';

/**
 * Restarts the Keycloak instance backing an add-on, without touching its data.
 *
 * @endpoint [POST] /v4/addon-providers/addon-keycloak/addons/:XXX/reboot
 * @group Keycloak
 * @version 4
 */
export class RebootKeycloakCommand extends CcApiSimpleCommand<RebootKeycloakCommandInput, undefined> {
  toRequestParams(params: RebootKeycloakCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/reboot`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  // each call queues a redeployment, so a replay restarts the instance a second time
  isIdempotent(): boolean {
    return false;
  }
}
