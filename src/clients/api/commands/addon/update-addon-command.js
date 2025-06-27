/**
 * @import { UpdateAddonCommandInput, UpdateAddonCommandOutput } from './update-addon-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddon } from './addon-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateAddonCommandInput, UpdateAddonCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/addons/:XXX
 * @group Addon
 * @version 2
 */
export class UpdateAddonCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateAddonCommandInput, UpdateAddonCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}`, { name: params.name });
  }

  /** @type {CcApiSimpleCommand<UpdateAddonCommandInput, UpdateAddonCommandOutput>['transformCommandOutput']} */
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
