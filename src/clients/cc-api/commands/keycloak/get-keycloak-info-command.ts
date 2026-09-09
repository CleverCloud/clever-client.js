import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetKeycloakInfoCommandInput, GetKeycloakInfoCommandOutput } from './get-keycloak-info-command.types.js';
import { transformKeycloakInfo } from './keycloak-transform.js';

/**
 * Retrieves a Keycloak add-on, with the URL to reach it, its initial credentials and the resources it is built on.
 *
 * @endpoint [GET] /v4/addon-providers/addon-keycloak/addons/:XXX
 * @group Keycloak
 * @version 4
 */
export class GetKeycloakInfoCommand extends CcApiSimpleCommand<
  GetKeycloakInfoCommandInput,
  GetKeycloakInfoCommandOutput
> {
  toRequestParams(params: GetKeycloakInfoCommandInput) {
    return get(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): GetKeycloakInfoCommandOutput {
    return transformKeycloakInfo(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
