import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetCellarObjectUploadUrlCommandInput,
  GetCellarObjectUploadUrlCommandOutput,
} from './get-cellar-object-upload-url-command.types.js';

/**
 * Mints a presigned URL that uploads one object without credentials.
 *
 * @endpoint [POST] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX/objects/:XXX/presigned-url
 * @group Cellar
 * @version 4
 */
export class GetCellarObjectUploadUrlCommand extends CcApiSimpleCommand<
  GetCellarObjectUploadUrlCommandInput,
  GetCellarObjectUploadUrlCommandOutput
> {
  toRequestParams(params: GetCellarObjectUploadUrlCommandInput) {
    return post(
      safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/buckets/${params.bucketName}/objects/${params.objectKey}/presigned-url`,
    );
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
