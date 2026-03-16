/**
 * @import { UpdateOtoroshiVersionCommandInput, UpdateOtoroshiVersionCommandOutput } from './update-otoroshi-version-command.types.js';
 */
import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOtoroshiInfo } from './otoroshi-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateOtoroshiVersionCommandInput, UpdateOtoroshiVersionCommandOutput>}
 * @endpoint [POST] /v4/addon-providers/addon-otoroshi/addons/:XXX/version/update
 * @group Otoroshi
 * @version 4
 */
export class UpdateOtoroshiVersionCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateOtoroshiVersionCommandInput, UpdateOtoroshiVersionCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return postJson(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/version/update`, {
      targetVersion: params.targetVersion,
    });
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<UpdateOtoroshiVersionCommandInput, UpdateOtoroshiVersionCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformOtoroshiInfo(response);
  }
}
