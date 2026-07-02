import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  CreateKeycloakNetworkGroupCommandInput,
  CreateKeycloakNetworkGroupCommandOutput,
} from './create-keycloak-network-group-command.types.js';
import { transformKeycloakInfo } from './keycloak-transform.js';

/**
 * @endpoint [POST] /v4/addon-providers/addon-keycloak/addons/:XXX/networkgroup
 * @group Keycloak
 * @version 4
 */
export class CreateKeycloakNetworkGroupCommand extends CcApiSimpleCommand<
  CreateKeycloakNetworkGroupCommandInput,
  CreateKeycloakNetworkGroupCommandOutput
> {
  toRequestParams(params: CreateKeycloakNetworkGroupCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/networkgroup`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): CreateKeycloakNetworkGroupCommandOutput {
    return transformKeycloakInfo(response);
  }
}
