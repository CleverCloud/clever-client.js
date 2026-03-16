/**
 * @import { RebootMetabaseCommandInput } from './reboot-metabase-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<RebootMetabaseCommandInput, void>}
 * @endpoint [POST] /v4/addon-providers/addon-metabase/addons/:XXX/reboot
 * @group Metabase
 * @version 4
 */
export class RebootMetabaseCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<RebootMetabaseCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/addon-providers/addon-metabase/addons/${params.addonId}/reboot`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<RebootMetabaseCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
