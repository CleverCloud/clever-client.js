/**
 * @import { RebuildKeycloakCommandInput } from './rebuild-keycloak-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<RebuildKeycloakCommandInput, void>}
 * @endpoint [POST] /v4/addon-providers/addon-keycloak/addons/:XXX/rebuild
 * @group Keycloak
 * @version 4
 */
export class RebuildKeycloakCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<RebuildKeycloakCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/rebuild`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<RebuildKeycloakCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
