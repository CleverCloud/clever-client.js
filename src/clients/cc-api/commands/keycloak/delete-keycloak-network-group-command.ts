import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteKeycloakNetworkGroupCommandInput } from './delete-keycloak-network-group-command.types.js';

/**
 * @endpoint [DELETE] /v4/addon-providers/addon-keycloak/addons/:XXX/networkgroup
 * @group Keycloak
 * @version 4
 */
export class DeleteKeycloakNetworkGroupCommand extends CcApiSimpleCommand<
  DeleteKeycloakNetworkGroupCommandInput,
  void
> {
  toRequestParams(params: DeleteKeycloakNetworkGroupCommandInput) {
    return delete_(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/networkgroup`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(): void {
    return null;
  }
}
