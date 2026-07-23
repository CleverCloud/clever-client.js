import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetCellarObjectDownloadUrlCommandInput,
  GetCellarObjectDownloadUrlCommandOutput,
} from './get-cellar-object-download-url-command.types.js';

/**
 * Mints a presigned URL that downloads one object without credentials.
 *
 * @endpoint [POST] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX/objects/download-url
 * @group Cellar
 * @version 4
 */
export class GetCellarObjectDownloadUrlCommand extends CcApiSimpleCommand<
  GetCellarObjectDownloadUrlCommandInput,
  GetCellarObjectDownloadUrlCommandOutput
> {
  toRequestParams(params: GetCellarObjectDownloadUrlCommandInput) {
    return postJson(
      safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/buckets/${params.bucketName}/objects/download-url`,
      {
        objectKey: params.objectKey,
        expiresIn: params.expiresIn,
      },
    );
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
