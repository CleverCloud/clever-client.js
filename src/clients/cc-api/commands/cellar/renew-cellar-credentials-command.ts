import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  RenewCellarCredentialsCommandInput,
  RenewCellarCredentialsCommandOutput,
} from './renew-cellar-credentials-command.types.js';

/**
 * @endpoint [POST] /v4/cellar/organisations/:XXX/cellar/:XXX/credentials/renew
 * @group Cellar
 * @version 4
 */
export class RenewCellarCredentialsCommand extends CcApiSimpleCommand<
  RenewCellarCredentialsCommandInput,
  RenewCellarCredentialsCommandOutput
> {
  toRequestParams(params: RenewCellarCredentialsCommandInput) {
    return post(safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/credentials/renew`);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
