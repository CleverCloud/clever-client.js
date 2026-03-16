/**
 * @import { CreateKeycloakNetworkGroupCommandInput, CreateKeycloakNetworkGroupCommandOutput } from './create-keycloak-network-group-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKeycloakInfo } from './keycloak-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateKeycloakNetworkGroupCommandInput, CreateKeycloakNetworkGroupCommandOutput>}
 * @endpoint [POST] /v4/addon-providers/addon-keycloak/addons/:XXX/networkgroup
 * @group Keycloak
 * @version 4
 */
export class CreateKeycloakNetworkGroupCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateKeycloakNetworkGroupCommandInput, CreateKeycloakNetworkGroupCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/networkgroup`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<CreateKeycloakNetworkGroupCommandInput, CreateKeycloakNetworkGroupCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformKeycloakInfo(response);
  }
}
