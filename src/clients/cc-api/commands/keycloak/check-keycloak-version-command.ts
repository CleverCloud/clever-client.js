import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  CheckKeycloakVersionCommandInput,
  CheckKeycloakVersionCommandOutput,
} from './check-keycloak-version-command.types.js';
import { transformKeycloakVersionCheck } from './keycloak-transform.js';

/**
 * Checks which Keycloak versions an add-on can be moved to, and whether it is behind.
 *
 * @endpoint [GET] /v4/addon-providers/addon-keycloak/addons/:XXX/version/check
 * @group Keycloak
 * @version 4
 */
export class CheckKeycloakVersionCommand extends CcApiSimpleCommand<
  CheckKeycloakVersionCommandInput,
  CheckKeycloakVersionCommandOutput
> {
  toRequestParams(params: CheckKeycloakVersionCommandInput) {
    return get(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/version/check`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): CheckKeycloakVersionCommandOutput {
    return transformKeycloakVersionCheck(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
