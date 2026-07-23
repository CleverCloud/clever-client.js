import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformCellarInfo } from './cellar-transform.js';
import type { GetCellarInfoCommandInput, GetCellarInfoCommandOutput } from './get-cellar-info-command.types.js';

/**
 * @endpoint [GET] /v4/cellar/organisations/:XXX/cellar/:XXX
 * @group Cellar
 * @version 4
 */
export class GetCellarInfoCommand extends CcApiSimpleCommand<GetCellarInfoCommandInput, GetCellarInfoCommandOutput> {
  toRequestParams(params: GetCellarInfoCommandInput) {
    return get(safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}`);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): GetCellarInfoCommandOutput {
    return transformCellarInfo(response);
  }
}
