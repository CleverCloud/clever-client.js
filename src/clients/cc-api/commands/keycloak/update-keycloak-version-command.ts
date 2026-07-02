import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformKeycloakInfo } from './keycloak-transform.js';
import type {
  UpdateKeycloakVersionCommandInput,
  UpdateKeycloakVersionCommandOutput,
} from './update-keycloak-version-command.types.js';

/**
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
}
