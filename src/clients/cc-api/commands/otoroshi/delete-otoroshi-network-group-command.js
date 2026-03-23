/**
 * @import { DeleteOtoroshiNetworkGroupCommandInput } from './delete-otoroshi-network-group-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteOtoroshiNetworkGroupCommandInput, void>}
 * @endpoint [DELETE] /v4/addon-providers/addon-otoroshi/addons/:XXX/networkgroup
 * @group Otoroshi
 * @version 4
 */
export class DeleteOtoroshiNetworkGroupCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteOtoroshiNetworkGroupCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/networkgroup`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<DeleteOtoroshiNetworkGroupCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
