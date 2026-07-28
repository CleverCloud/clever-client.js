import { QueryParams } from '../../../../lib/request/query-params.js';
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteCellarBucketCommandInput } from './delete-cellar-bucket-command.types.js';

/**
 * Removes a bucket from a Cellar add-on.
 *
 * A bucket that still holds objects is only removed when the purge is asked for.
 *
 * @endpoint [DELETE] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX
 * @group Cellar
 * @version 4
 */
export class DeleteCellarBucketCommand extends CcApiSimpleCommand<DeleteCellarBucketCommandInput, undefined> {
  toRequestParams(params: DeleteCellarBucketCommandInput) {
    return delete_(
      safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/buckets/${params.bucketName}`,
      new QueryParams().append('purgeObjects', params.shouldPurgeObjects),
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
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
