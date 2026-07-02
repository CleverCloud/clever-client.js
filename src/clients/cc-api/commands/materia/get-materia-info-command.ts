import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetMateriaInfoCommandInput, GetMateriaInfoCommandOutput } from './get-materia-info-command.types.js';

/**
 * @endpoint [GET] /v4/materia/organisations/:XXX/materia/databases/:XXX
 * @group Materia
 * @version 4
 */
export class GetMateriaInfoCommand extends CcApiSimpleCommand<GetMateriaInfoCommandInput, GetMateriaInfoCommandOutput> {
  toRequestParams(params: GetMateriaInfoCommandInput) {
    return get(safeUrl`/v4/materia/organisations/${params.ownerId}/materia/databases/${params.addonId}`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
