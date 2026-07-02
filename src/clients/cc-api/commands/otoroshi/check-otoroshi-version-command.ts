import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  CheckOtoroshiVersionCommandInput,
  CheckOtoroshiVersionCommandOutput,
} from './check-otoroshi-version-command.types.js';

/**
 * @endpoint [GET] /v4/addon-providers/addon-otoroshi/addons/:XXX/version/check
 * @group Otoroshi
 * @version 4
 */
export class CheckOtoroshiVersionCommand extends CcApiSimpleCommand<
  CheckOtoroshiVersionCommandInput,
  CheckOtoroshiVersionCommandOutput
> {
  toRequestParams(params: CheckOtoroshiVersionCommandInput) {
    return get(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/version/check`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): CheckOtoroshiVersionCommandOutput {
    const res = response as CheckOtoroshiVersionCommandOutput;
    return {
      installed: res.installed,
      available: res.available,
      needUpdate: res.needUpdate,
      latest: res.latest,
    };
  }
}
