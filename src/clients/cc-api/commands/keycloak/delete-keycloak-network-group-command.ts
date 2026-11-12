import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { DeleteKeycloakNetworkGroupCommandInput } from './delete-keycloak-network-group-command.types.ts';

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
