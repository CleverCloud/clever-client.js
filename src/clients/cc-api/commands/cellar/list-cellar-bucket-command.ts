import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  ListCellarBucketCommandInput,
  ListCellarBucketCommandOutput,
} from './list-cellar-bucket-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `CELLAR_NOT_FOUND`: the add-on does not exist, or does not belong to the given owner
 */
export const LIST_CELLAR_BUCKET_ERROR_CODES = {
  CELLAR_NOT_FOUND: 'clever.cellar.not-found',
} as const;

export type ListCellarBucketErrorCode =
  (typeof LIST_CELLAR_BUCKET_ERROR_CODES)[keyof typeof LIST_CELLAR_BUCKET_ERROR_CODES];

/**
 * Lists the buckets of a Cellar add-on.
 *
 * Common error codes: see {@link LIST_CELLAR_BUCKET_ERROR_CODES}
 *
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
