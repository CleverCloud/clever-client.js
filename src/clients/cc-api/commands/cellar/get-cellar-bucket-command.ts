import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetCellarBucketCommandInput, GetCellarBucketCommandOutput } from './get-cellar-bucket-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `CELLAR_NOT_FOUND`: the add-on does not exist, or does not belong to the given owner
 * - `BUCKET_NOT_FOUND`: the bucket does not exist in the add-on
 */
export const GET_CELLAR_BUCKET_ERROR_CODES = {
  CELLAR_NOT_FOUND: 'clever.cellar.not-found',
  BUCKET_NOT_FOUND: 'clever.cellar.bucket-not-found',
} as const;

export type GetCellarBucketErrorCode =
  (typeof GET_CELLAR_BUCKET_ERROR_CODES)[keyof typeof GET_CELLAR_BUCKET_ERROR_CODES];

/**
 * Retrieves one bucket, with its versioning status.
 *
 * Common error codes: see {@link GET_CELLAR_BUCKET_ERROR_CODES}
 *
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

  isIdempotent(): boolean {
    return true;
  }
}
