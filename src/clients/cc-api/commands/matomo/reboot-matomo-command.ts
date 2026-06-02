import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { RebootMatomoCommandInput } from './reboot-matomo-command.types.js';

/**
 * @endpoint [POST] /v4/addon-providers/addon-matomo/addons/:XXX/reboot
 * @group Matomo
 * @version 4
 */
export class RebootMatomoCommand extends CcApiSimpleCommand<RebootMatomoCommandInput, void> {
  toRequestParams(params: RebootMatomoCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-matomo/addons/${params.addonId}/reboot`);
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
