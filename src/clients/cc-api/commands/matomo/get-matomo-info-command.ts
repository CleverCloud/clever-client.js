import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetMatomoInfoCommandInput, GetMatomoInfoCommandOutput } from './get-matomo-info-command.types.js';
import { transformMatomoInfo } from './matomo-transform.js';

/**
 * @endpoint [GET] /v4/addon-providers/addon-matomo/addons/:XXX
 * @group Matomo
 * @version 4
 */
export class GetMatomoInfoCommand extends CcApiSimpleCommand<GetMatomoInfoCommandInput, GetMatomoInfoCommandOutput> {
  toRequestParams(params: GetMatomoInfoCommandInput) {
    return get(safeUrl`/v4/addon-providers/addon-matomo/addons/${params.addonId}`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): GetMatomoInfoCommandOutput {
    return transformMatomoInfo(response);
  }
}
