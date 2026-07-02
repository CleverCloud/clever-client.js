import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformAddonSso } from './addon-transform.js';
import type { GetAddonSsoCommandInput, GetAddonSsoCommandOutput } from './get-addon-sso-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/sso
 * @group Addon
 * @version 2
 */
export class GetAddonSsoCommand extends CcApiSimpleCommand<GetAddonSsoCommandInput, GetAddonSsoCommandOutput> {
  toRequestParams(params: GetAddonSsoCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/sso`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetAddonSsoCommandOutput {
    return transformAddonSso(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
