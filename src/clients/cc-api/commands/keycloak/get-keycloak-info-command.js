/**
 * @import { GetKeycloakInfoCommandInput, GetKeycloakInfoCommandOutput } from './get-keycloak-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKeycloakInfo } from './keycloak-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetKeycloakInfoCommandInput, GetKeycloakInfoCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/addon-keycloak/addons/:XXX
 * @group Keycloak
 * @version 4
 */
export class GetKeycloakInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetKeycloakInfoCommandInput, GetKeycloakInfoCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<GetKeycloakInfoCommandInput, GetKeycloakInfoCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformKeycloakInfo(response);
  }
}
