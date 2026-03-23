/**
 * @import { GetMetabaseInfoCommandInput, GetMetabaseInfoCommandOutput } from './get-metabase-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformMetabaseInfo } from './metabase-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetMetabaseInfoCommandInput, GetMetabaseInfoCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/addon-metabase/addons/:XXX
 * @group Metabase
 * @version 4
 */
export class GetMetabaseInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetMetabaseInfoCommandInput, GetMetabaseInfoCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/addon-metabase/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetMetabaseInfoCommandInput, GetMetabaseInfoCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformMetabaseInfo(response);
  }
}
