/**
 * @import { GetAddonSsoCommandInput, GetAddonSsoCommandOutput } from './get-addon-sso-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
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

  /** @type {CcApiSimpleCommand<GetAddonSsoCommandInput, GetAddonSsoCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<GetAddonSsoCommandInput, GetAddonSsoCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    // @ts-ignore
    return {
      ...omit(response, 'user_id', 'userinfo_signature', 'nav-data'),
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
