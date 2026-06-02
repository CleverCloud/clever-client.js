import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformOtoroshiInfo } from './otoroshi-transform.js';
import type {
  UpdateOtoroshiVersionCommandInput,
  UpdateOtoroshiVersionCommandOutput,
} from './update-otoroshi-version-command.types.js';

/**
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
}
