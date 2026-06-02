import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { RebuildMetabaseCommandInput } from './rebuild-metabase-command.types.js';

/**
 * @endpoint [POST] /v4/addon-providers/addon-metabase/addons/:XXX/rebuild
 * @group Metabase
 * @version 4
 */
export class RebuildMetabaseCommand extends CcApiSimpleCommand<RebuildMetabaseCommandInput, void> {
  toRequestParams(params: RebuildMetabaseCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-metabase/addons/${params.addonId}/rebuild`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(): void {
    return null;
  }
}
