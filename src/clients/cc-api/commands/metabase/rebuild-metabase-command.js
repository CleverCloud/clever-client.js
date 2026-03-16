/**
 * @import { RebuildMetabaseCommandInput } from './rebuild-metabase-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<RebuildMetabaseCommandInput, void>}
 * @endpoint [POST] /v4/addon-providers/addon-metabase/addons/:XXX/rebuild
 * @group Metabase
 * @version 4
 */
export class RebuildMetabaseCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<RebuildMetabaseCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/addon-providers/addon-metabase/addons/${params.addonId}/rebuild`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<RebuildMetabaseCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
