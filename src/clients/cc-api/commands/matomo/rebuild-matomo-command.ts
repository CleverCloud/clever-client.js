import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { RebuildMatomoCommandInput } from './rebuild-matomo-command.types.js';

/**
 * @endpoint [POST] /v4/addon-providers/addon-matomo/addons/:XXX/rebuild
 * @group Matomo
 * @version 4
 */
export class RebuildMatomoCommand extends CcApiSimpleCommand<RebuildMatomoCommandInput, void> {
  toRequestParams(params: RebuildMatomoCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-matomo/addons/${params.addonId}/rebuild`);
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
