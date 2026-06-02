import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { RebootOtoroshiCommandInput } from './reboot-otoroshi-command.types.js';

/**
 * @endpoint [POST] /v4/addon-providers/addon-otoroshi/addons/:XXX/reboot
 * @group Otoroshi
 * @version 4
 */
export class RebootOtoroshiCommand extends CcApiSimpleCommand<RebootOtoroshiCommandInput, void> {
  toRequestParams(params: RebootOtoroshiCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/reboot`);
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
