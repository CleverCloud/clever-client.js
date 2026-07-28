import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetCellarObjectCommandInput, GetCellarObjectCommandOutput } from './get-cellar-object-command.types.js';

/**
 * Retrieves the metadata of one stored object: its tags, its access control list and its user
 * metadata. The object content itself is fetched through a download URL.
 *
 * @endpoint [GET] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX/objects/:XXX
 * @group Cellar
 * @version 4
 */
export class GetCellarObjectCommand extends CcApiSimpleCommand<
  GetCellarObjectCommandInput,
  GetCellarObjectCommandOutput
> {
  toRequestParams(params: GetCellarObjectCommandInput) {
    return get(
      safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/buckets/${params.bucketName}/objects/${params.objectKey}`,
    );
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
