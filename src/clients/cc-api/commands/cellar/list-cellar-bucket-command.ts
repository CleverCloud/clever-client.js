import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  ListCellarBucketCommandInput,
  ListCellarBucketCommandOutput,
} from './list-cellar-bucket-command.types.js';

/**
 * @endpoint [GET] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets
 * @group Cellar
 * @version 4
 */
export class ListCellarBucketCommand extends CcApiSimpleCommand<
  ListCellarBucketCommandInput,
  ListCellarBucketCommandOutput
> {
  toRequestParams(params: ListCellarBucketCommandInput) {
    return get(safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/buckets`);
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: { buckets: [], total: 0 } };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
