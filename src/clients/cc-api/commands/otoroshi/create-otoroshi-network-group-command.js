/**
 * @import { CreateOtoroshiNetworkGroupCommandInput, CreateOtoroshiNetworkGroupCommandOutput } from './create-otoroshi-network-group-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOtoroshiInfo } from './otoroshi-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateOtoroshiNetworkGroupCommandInput, CreateOtoroshiNetworkGroupCommandOutput>}
 * @endpoint [POST] /v4/addon-providers/addon-otoroshi/addons/:XXX/networkgroup
 * @group Otoroshi
 * @version 4
 */
export class CreateOtoroshiNetworkGroupCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateOtoroshiNetworkGroupCommandInput, CreateOtoroshiNetworkGroupCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/networkgroup`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<CreateOtoroshiNetworkGroupCommandInput, CreateOtoroshiNetworkGroupCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformOtoroshiInfo(response);
  }
}
