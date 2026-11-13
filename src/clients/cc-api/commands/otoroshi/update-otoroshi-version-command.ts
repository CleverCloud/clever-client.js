import { postJson } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformOtoroshiInfo } from './otoroshi-transform.ts';
import type {
  UpdateOtoroshiVersionCommandInput,
  UpdateOtoroshiVersionCommandOutput,
} from './update-otoroshi-version-command.types.ts';

/**
 * Moves an add-on to another Otoroshi version.
 *
 * The instance is rebuilt on the target version, so it is unavailable for the duration.
 *
 * @endpoint [POST] /v4/addon-providers/addon-otoroshi/addons/:XXX/version/update
 * @group Otoroshi
 * @version 4
 */
export class UpdateOtoroshiVersionCommand extends CcApiSimpleCommand<
  UpdateOtoroshiVersionCommandInput,
  UpdateOtoroshiVersionCommandOutput
> {
  toRequestParams(params: UpdateOtoroshiVersionCommandInput) {
    return postJson(safeUrl`/v4/addon-providers/addon-otoroshi/addons/${params.addonId}/version/update`, {
      targetVersion: params.targetVersion,
    });
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): UpdateOtoroshiVersionCommandOutput {
    return transformOtoroshiInfo(response);
  }

  // setting the version env vars converges, but every call also redeploys the instance
  isIdempotent(): boolean {
    return false;
  }
}
