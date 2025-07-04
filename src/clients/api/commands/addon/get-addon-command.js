/**
 * @import { GetAddonCommandInput, GetAddonCommandOutput } from './get-addon-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddon } from './addon-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetAddonCommandInput, GetAddonCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX
 * @group Addon
 * @version 2
 */
export class GetAddonCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetAddonCommandInput, GetAddonCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetAddonCommandInput, GetAddonCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformAddon(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
