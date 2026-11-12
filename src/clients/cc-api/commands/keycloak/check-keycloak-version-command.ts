import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  CheckKeycloakVersionCommandInput,
  CheckKeycloakVersionCommandOutput,
} from './check-keycloak-version-command.types.ts';
import { transformKeycloakVersionCheck } from './keycloak-transform.ts';

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
