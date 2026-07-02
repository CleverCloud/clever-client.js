import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { RebuildOtoroshiCommandInput } from './rebuild-otoroshi-command.types.js';

/**
 * @endpoint [POST] /v4/addon-providers/addon-otoroshi/addons/:XXX/rebuild
 * @group Otoroshi
 * @version 4
 */
export class RebuildOtoroshiCommand extends CcApiSimpleCommand<RebuildOtoroshiCommandInput, undefined> {
  toRequestParams(params: RebuildOtoroshiCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/rebuild`);
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
