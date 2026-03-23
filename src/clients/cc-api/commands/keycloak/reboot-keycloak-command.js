/**
 * @import { RebootKeycloakCommandInput } from './reboot-keycloak-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<RebootKeycloakCommandInput, void>}
 * @endpoint [POST] /v4/addon-providers/addon-keycloak/addons/:XXX/reboot
 * @group Keycloak
 * @version 4
 */
export class RebootKeycloakCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<RebootKeycloakCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/addon-providers/addon-keycloak/addons/${params.addonId}/reboot`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<RebootKeycloakCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
