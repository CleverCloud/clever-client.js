import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetCellarCredentialsCommandInput,
  GetCellarCredentialsCommandOutput,
} from './get-cellar-credentials-command.types.js';

/**
 * @endpoint [GET] /v4/cellar/organisations/:XXX/cellar/:XXX/credentials
 * @group Cellar
 * @version 4
 */
export class GetCellarCredentialsCommand extends CcApiSimpleCommand<
  GetCellarCredentialsCommandInput,
  GetCellarCredentialsCommandOutput
> {
  toRequestParams(params: GetCellarCredentialsCommandInput) {
    return get(safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/credentials`);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
