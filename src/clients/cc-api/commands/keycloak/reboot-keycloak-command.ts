import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { RebootKeycloakCommandInput } from './reboot-keycloak-command.types.js';

/**
 * @endpoint [POST] /v4/addon-providers/addon-keycloak/addons/:XXX/reboot
 * @group Keycloak
 * @version 4
 */
export class RebootKeycloakCommand extends CcApiSimpleCommand<RebootKeycloakCommandInput, void> {
  toRequestParams(params: RebootKeycloakCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/reboot`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(): void {
    return null;
  }
}
