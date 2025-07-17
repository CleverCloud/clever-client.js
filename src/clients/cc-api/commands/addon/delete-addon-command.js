/**
 * @import { DeleteAddonCommandInput } from './delete-addon-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteAddonCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/addons/:XXX
 * @group Addon
 * @version 2
 */
export class DeleteAddonCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteAddonCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<DeleteAddonCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput(_response) {
    return null;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
