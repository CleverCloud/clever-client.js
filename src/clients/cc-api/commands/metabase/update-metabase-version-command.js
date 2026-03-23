/**
 * @import { UpdateMetabaseVersionCommandInput, UpdateMetabaseVersionCommandOutput } from './update-metabase-version-command.types.js';
 */
import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformMetabaseInfo } from './metabase-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateMetabaseVersionCommandInput, UpdateMetabaseVersionCommandOutput>}
 * @endpoint [POST] /v4/addon-providers/addon-metabase/addons/:XXX/version/update
 * @group Metabase
 * @version 4
 */
export class UpdateMetabaseVersionCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateMetabaseVersionCommandInput, UpdateMetabaseVersionCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return postJson(safeUrl`/v4/addon-providers/addon-metabase/addons/${params.addonId}/version/update`, {
      targetVersion: params.targetVersion,
    });
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<UpdateMetabaseVersionCommandInput, UpdateMetabaseVersionCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformMetabaseInfo(response);
  }
}
