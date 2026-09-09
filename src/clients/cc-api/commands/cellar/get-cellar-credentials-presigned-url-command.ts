import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetCellarCredentialsPresignedUrlCommandInput,
  GetCellarCredentialsPresignedUrlCommandOutput,
} from './get-cellar-credentials-presigned-url-command.types.js';

/**
 * Retrieves a presigned URL that reveals the Cellar credentials without going through the API again.
 *
 * @endpoint [GET] /v4/cellar/organisations/:XXX/cellar/:XXX/credentials/presigned-url
 * @group Cellar
 * @version 4
 */
export class GetCellarCredentialsPresignedUrlCommand extends CcApiSimpleCommand<
  GetCellarCredentialsPresignedUrlCommandInput,
  GetCellarCredentialsPresignedUrlCommandOutput
> {
  toRequestParams(params: GetCellarCredentialsPresignedUrlCommandInput) {
    return get(safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/credentials/presigned-url`);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  // the URL is signed on the fly and the token is not stored anywhere, so a replay only mints a second short lived one
  isIdempotent(): boolean {
    return true;
  }
}
