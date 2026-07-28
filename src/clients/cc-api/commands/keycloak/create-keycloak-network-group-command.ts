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
 * Puts a Keycloak add-on behind a network group, so it is only reachable from the peers of that
 * private network instead of the public internet.
 *
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

  // every call allocates a new network group id, so a replay leaves the previous one behind and restarts the add-on
  isIdempotent(): boolean {
    return false;
  }
}
