/**
 * @import { RebuildOtoroshiCommandInput } from './rebuild-otoroshi-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<RebuildOtoroshiCommandInput, void>}
 * @endpoint [POST] /v4/addon-providers/addon-otoroshi/addons/:XXX/rebuild
 * @group Otoroshi
 * @version 4
 */
export class RebuildOtoroshiCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<RebuildOtoroshiCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/rebuild`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<RebuildOtoroshiCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
