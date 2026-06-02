import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { RebuildKeycloakCommandInput } from './rebuild-keycloak-command.types.js';

/**
 * @endpoint [POST] /v4/addon-providers/addon-keycloak/addons/:XXX/rebuild
 * @group Keycloak
 * @version 4
 */
export class RebuildKeycloakCommand extends CcApiSimpleCommand<RebuildKeycloakCommandInput, void> {
  toRequestParams(params: RebuildKeycloakCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/rebuild`);
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
