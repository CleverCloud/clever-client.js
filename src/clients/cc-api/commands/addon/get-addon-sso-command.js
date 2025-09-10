/**
 * @import { GetAddonSsoCommandInput, GetAddonSsoCommandOutput } from './get-addon-sso-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetAddonSsoCommandInput, GetAddonSsoCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/sso
 * @group Addon
 * @version 2
 */
export class GetAddonSsoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetAddonSsoCommandInput, GetAddonSsoCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/sso`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetAddonSsoCommandInput, GetAddonSsoCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      url: response.url,
      id: response.id,
      timestamp: response.timestamp,
      token: response.token,
      signature: response.signature,
      email: response.email,
      name: response.name,
      userId: response.user_id,
      userInfoSignature: response.userinfo_signature,
      navData: response['nav-data'],
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
