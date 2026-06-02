/**
 * @import { RebootMatomoCommandInput } from './reboot-matomo-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<RebootMatomoCommandInput, void>}
 * @endpoint [POST] /v4/addon-providers/addon-matomo/addons/:XXX/reboot
 * @group Matomo
 * @version 4
 */
export class RebootMatomoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<RebootMatomoCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/addon-providers/addon-matomo/addons/${params.addonId}/reboot`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<RebootMatomoCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
