import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  CreateCellarBucketCommandInput,
  CreateCellarBucketCommandOutput,
} from './create-cellar-bucket-command.types.js';

/**
 * Creates a bucket in a Cellar add-on.
 *
 * @endpoint [POST] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets
 * @group Cellar
 * @version 4
 */
export class CreateCellarBucketCommand extends CcApiSimpleCommand<
  CreateCellarBucketCommandInput,
  CreateCellarBucketCommandOutput
> {
  toRequestParams(params: CreateCellarBucketCommandInput) {
    return postJson(safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/buckets`, {
      name: params.name,
      versioning: params.versioning ?? false,
    });
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  // the bucket name is the caller's and the handler refuses a name that already exists, so a replay creates nothing
  isIdempotent(): boolean {
    return true;
  }
}
