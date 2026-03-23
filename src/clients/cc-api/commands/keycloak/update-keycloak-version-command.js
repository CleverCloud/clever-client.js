/**
 * @import { UpdateKeycloakVersionCommandInput, UpdateKeycloakVersionCommandOutput } from './update-keycloak-version-command.types.js';
 */
import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKeycloakInfo } from './keycloak-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateKeycloakVersionCommandInput, UpdateKeycloakVersionCommandOutput>}
 * @endpoint [POST] /v4/addon-providers/addon-keycloak/addons/:XXX/version/update
 * @group Keycloak
 * @version 4
 */
export class UpdateKeycloakVersionCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateKeycloakVersionCommandInput, UpdateKeycloakVersionCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return postJson(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/version/update`, {
      targetVersion: params.targetVersion,
    });
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<UpdateKeycloakVersionCommandInput, UpdateKeycloakVersionCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformKeycloakInfo(response);
  }
}
