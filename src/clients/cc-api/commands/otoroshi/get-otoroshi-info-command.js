/**
 * @import { GetOtoroshiInfoCommandInput, GetOtoroshiInfoCommandOutput } from './get-otoroshi-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOtoroshiInfo } from './otoroshi-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetOtoroshiInfoCommandInput, GetOtoroshiInfoCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/addon-otoroshi/addons/:XXX
 * @group Otoroshi
 * @version 4
 */
export class GetOtoroshiInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetOtoroshiInfoCommandInput, GetOtoroshiInfoCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetOtoroshiInfoCommandInput, GetOtoroshiInfoCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformOtoroshiInfo(response);
  }
}
