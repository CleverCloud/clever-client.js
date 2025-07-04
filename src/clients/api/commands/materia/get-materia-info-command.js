/**
 * @import { GetMateriaInfoCommandInput, GetMateriaInfoCommandOutput } from './get-materia-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetMateriaInfoCommandInput, GetMateriaInfoCommandOutput>}
 * @endpoint [GET] /v4/materia/organisations/:XXX/materia/databases/:XXX
 * @group Materia
 * @version 4
 */
export class GetMateriaInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetMateriaInfoCommandInput, GetMateriaInfoCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/materia/organisations/${params.ownerId}/materia/databases/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
