import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  CheckOtoroshiVersionCommandInput,
  CheckOtoroshiVersionCommandOutput,
} from './check-otoroshi-version-command.types.ts';
import { transformOtoroshiVersionCheck } from './otoroshi-transform.ts';

/**
 * Checks which Otoroshi versions an add-on can be moved to, and whether it is behind.
 *
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
    return transformOtoroshiVersionCheck(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
