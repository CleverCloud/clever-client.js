import { QueryParams } from '../../../../lib/request/query-params.js';
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteCellarBucketCommandInput } from './delete-cellar-bucket-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `CELLAR_NOT_FOUND`: the add-on does not exist, or does not belong to the given owner
 * - `BUCKET_NOT_FOUND`: the bucket does not exist in the add-on
 * - `BUCKET_NOT_EMPTY`: the bucket still holds objects and the purge was not asked for
 */
export const DELETE_CELLAR_BUCKET_ERROR_CODES = {
  CELLAR_NOT_FOUND: 'clever.cellar.not-found',
  BUCKET_NOT_FOUND: 'clever.cellar.bucket-not-found',
  BUCKET_NOT_EMPTY: 'clever.cellar.bucket-not-empty',
} as const;

export type DeleteCellarBucketErrorCode =
  (typeof DELETE_CELLAR_BUCKET_ERROR_CODES)[keyof typeof DELETE_CELLAR_BUCKET_ERROR_CODES];

/**
 * Removes a bucket from a Cellar add-on.
 *
 * A bucket that still holds objects is only removed when the purge is asked for.
 *
 * Common error codes: see {@link DELETE_CELLAR_BUCKET_ERROR_CODES}
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
