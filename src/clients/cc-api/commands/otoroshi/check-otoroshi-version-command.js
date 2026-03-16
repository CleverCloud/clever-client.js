/**
 * @import { CheckOtoroshiVersionCommandInput, CheckOtoroshiVersionCommandOutput } from './check-otoroshi-version-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CheckOtoroshiVersionCommandInput, CheckOtoroshiVersionCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/addon-otoroshi/addons/:XXX/version/check
 * @group Otoroshi
 * @version 4
 */
export class CheckOtoroshiVersionCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CheckOtoroshiVersionCommandInput, CheckOtoroshiVersionCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/version/check`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<CheckOtoroshiVersionCommandInput, CheckOtoroshiVersionCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      installed: response.installed,
      available: response.available,
      needUpdate: response.needUpdate,
      latest: response.latest,
    };
  }
}
