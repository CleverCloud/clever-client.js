import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetCellarBucketCommandInput, GetCellarBucketCommandOutput } from './get-cellar-bucket-command.types.js';

/**
 * @endpoint [GET] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX
 * @group Cellar
 * @version 4
 */
export class GetCellarBucketCommand extends CcApiSimpleCommand<
  GetCellarBucketCommandInput,
  GetCellarBucketCommandOutput
> {
  toRequestParams(params: GetCellarBucketCommandInput) {
    return get(
      safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/buckets/${params.bucketName}`,
    );
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
