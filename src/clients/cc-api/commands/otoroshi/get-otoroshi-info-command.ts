import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetOtoroshiInfoCommandInput, GetOtoroshiInfoCommandOutput } from './get-otoroshi-info-command.types.js';
import { transformOtoroshiInfo } from './otoroshi-transform.js';

/**
 * @endpoint [GET] /v4/addon-providers/addon-otoroshi/addons/:XXX
 * @group Otoroshi
 * @version 4
 */
export class GetOtoroshiInfoCommand extends CcApiSimpleCommand<
  GetOtoroshiInfoCommandInput,
  GetOtoroshiInfoCommandOutput
> {
  toRequestParams(params: GetOtoroshiInfoCommandInput) {
    return get(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetOtoroshiInfoCommandOutput {
    return transformOtoroshiInfo(response);
  }
}
