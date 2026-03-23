/**
 * @import { CheckMetabaseVersionCommandInput, CheckMetabaseVersionCommandOutput } from './check-metabase-version-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CheckMetabaseVersionCommandInput, CheckMetabaseVersionCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/addon-metabase/addons/:XXX/version/check
 * @group Metabase
 * @version 4
 */
export class CheckMetabaseVersionCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CheckMetabaseVersionCommandInput, CheckMetabaseVersionCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/addon-metabase/addons/${params.addonId}/version/check`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<CheckMetabaseVersionCommandInput, CheckMetabaseVersionCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      installed: response.installed,
      available: response.available,
      needUpdate: response.needUpdate,
      latest: response.latest,
    };
  }
}
