/**
 * @import { DeleteKeycloakNetworkGroupCommandInput } from './delete-keycloak-network-group-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteKeycloakNetworkGroupCommandInput, void>}
 * @endpoint [DELETE] /v4/addon-providers/addon-keycloak/addons/:XXX/networkgroup
 * @group Keycloak
 * @version 4
 */
export class DeleteKeycloakNetworkGroupCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteKeycloakNetworkGroupCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/networkgroup`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<DeleteKeycloakNetworkGroupCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
