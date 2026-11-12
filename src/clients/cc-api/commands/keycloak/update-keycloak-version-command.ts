import { postJson } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformKeycloakInfo } from './keycloak-transform.ts';
import type {
  UpdateKeycloakVersionCommandInput,
  UpdateKeycloakVersionCommandOutput,
} from './update-keycloak-version-command.types.ts';

/**
 * Moves an add-on to another Keycloak version.
 *
 * The instance is rebuilt on the target version, so it is unavailable for the duration.
 *
 * @endpoint [POST] /v4/addon-providers/addon-keycloak/addons/:XXX/version/update
 * @group Keycloak
 * @version 4
 */
export class UpdateKeycloakVersionCommand extends CcApiSimpleCommand<
  UpdateKeycloakVersionCommandInput,
  UpdateKeycloakVersionCommandOutput
> {
  toRequestParams(params: UpdateKeycloakVersionCommandInput) {
    return postJson(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/version/update`, {
      targetVersion: params.targetVersion,
    });
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): UpdateKeycloakVersionCommandOutput {
    return transformKeycloakInfo(response);
  }

  // setting the version env var converges, but every call also redeploys the instance
  isIdempotent(): boolean {
    return false;
  }
}
