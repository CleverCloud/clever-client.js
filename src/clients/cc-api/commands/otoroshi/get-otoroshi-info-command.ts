import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { GetOtoroshiInfoCommandInput, GetOtoroshiInfoCommandOutput } from './get-otoroshi-info-command.types.ts';
import { transformOtoroshiInfo } from './otoroshi-transform.ts';

/**
 * Retrieves a Otoroshi add-on, with the URL to reach it, its admin API credentials and the resources it is built on.
 *
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

  transformCommandOutput(response: unknown): GetOtoroshiInfoCommandOutput {
    return transformOtoroshiInfo(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
