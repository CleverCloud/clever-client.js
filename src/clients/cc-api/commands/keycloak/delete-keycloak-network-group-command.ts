import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteKeycloakNetworkGroupCommandInput } from './delete-keycloak-network-group-command.types.js';

/**
 * Takes a Keycloak add-on out of its network group, making it publicly reachable again.
 *
 * @endpoint [DELETE] /v4/addon-providers/addon-keycloak/addons/:XXX/networkgroup
 * @group Keycloak
 * @version 4
 */
export class DeleteKeycloakNetworkGroupCommand extends CcApiSimpleCommand<
  DeleteKeycloakNetworkGroupCommandInput,
  undefined
> {
  toRequestParams(params: DeleteKeycloakNetworkGroupCommandInput) {
    return delete_(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/networkgroup`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  // the network group is gone on the second call, but the add-on is restarted again whatever happens
  isIdempotent(): boolean {
    return false;
  }
}
