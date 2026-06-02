/**
 * @import { RebuildMatomoCommandInput } from './rebuild-matomo-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<RebuildMatomoCommandInput, void>}
 * @endpoint [POST] /v4/addon-providers/addon-matomo/addons/:XXX/rebuild
 * @group Matomo
 * @version 4
 */
export class RebuildMatomoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<RebuildMatomoCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/addon-providers/addon-matomo/addons/${params.addonId}/rebuild`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<RebuildMatomoCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
