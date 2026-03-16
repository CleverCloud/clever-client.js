/**
 * @import { RebootOtoroshiCommandInput } from './reboot-otoroshi-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<RebootOtoroshiCommandInput, void>}
 * @endpoint [POST] /v4/addon-providers/addon-otoroshi/addons/:XXX/reboot
 * @group Otoroshi
 * @version 4
 */
export class RebootOtoroshiCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<RebootOtoroshiCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/reboot`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<RebootOtoroshiCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
