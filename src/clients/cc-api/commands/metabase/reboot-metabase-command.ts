import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { RebootMetabaseCommandInput } from './reboot-metabase-command.types.js';

/**
 * @endpoint [POST] /v4/addon-providers/addon-metabase/addons/:XXX/reboot
 * @group Metabase
 * @version 4
 */
export class RebootMetabaseCommand extends CcApiSimpleCommand<RebootMetabaseCommandInput, undefined> {
  toRequestParams(params: RebootMetabaseCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-metabase/addons/${params.addonId}/reboot`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
