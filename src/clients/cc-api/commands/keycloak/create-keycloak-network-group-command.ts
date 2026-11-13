import { post } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  CreateKeycloakNetworkGroupCommandInput,
  CreateKeycloakNetworkGroupCommandOutput,
} from './create-keycloak-network-group-command.types.ts';
import { transformKeycloakInfo } from './keycloak-transform.ts';

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
