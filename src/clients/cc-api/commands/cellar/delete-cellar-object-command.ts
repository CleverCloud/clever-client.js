import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteCellarObjectCommandInput } from './delete-cellar-object-command.types.js';

/**
 * Removes one object from a bucket.
 *
 * @endpoint [DELETE] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX/objects/:XXX
 * @group Cellar
 * @version 4
 */
export class DeleteCellarObjectCommand extends CcApiSimpleCommand<DeleteCellarObjectCommandInput, undefined> {
  toRequestParams(params: DeleteCellarObjectCommandInput) {
    return delete_(
      safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/buckets/${params.bucketName}/objects/${params.objectKey}`,
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
