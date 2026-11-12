import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  GetCellarCredentialsCommandInput,
  GetCellarCredentialsCommandOutput,
} from './get-cellar-credentials-command.types.ts';

/**
 * Retrieves the S3 credentials of a Cellar add-on.
 *
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

  // reads the stored credentials, it does not mint any
  isIdempotent(): boolean {
    return true;
  }
}
