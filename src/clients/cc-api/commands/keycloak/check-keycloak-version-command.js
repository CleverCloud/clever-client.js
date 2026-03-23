/**
 * @import { CheckKeycloakVersionCommandInput, CheckKeycloakVersionCommandOutput } from './check-keycloak-version-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CheckKeycloakVersionCommandInput, CheckKeycloakVersionCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/addon-keycloak/addons/:XXX/version/check
 * @group Keycloak
 * @version 4
 */
export class CheckKeycloakVersionCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CheckKeycloakVersionCommandInput, CheckKeycloakVersionCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/version/check`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<CheckKeycloakVersionCommandInput, CheckKeycloakVersionCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      installed: response.installed,
      available: response.available,
      latest: response.latest,
      needUpdate: response.needUpdate,
    };
  }
}
