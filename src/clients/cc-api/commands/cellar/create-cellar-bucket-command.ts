import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  CreateCellarBucketCommandInput,
  CreateCellarBucketCommandOutput,
} from './create-cellar-bucket-command.types.js';

/**
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
}
