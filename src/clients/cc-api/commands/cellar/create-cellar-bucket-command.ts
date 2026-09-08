import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  CreateCellarBucketCommandInput,
  CreateCellarBucketCommandOutput,
} from './create-cellar-bucket-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `CELLAR_NOT_FOUND`: the add-on does not exist, or does not belong to the given owner
 * - `INVALID_BUCKET_NAME`: the given name is not a valid bucket name
 * - `BUCKET_ALREADY_EXISTS`: a bucket with that name already exists
 * - `TOO_MANY_BUCKETS`: the add-on has reached the number of buckets it is allowed
 */
export const CREATE_CELLAR_BUCKET_ERROR_CODES = {
  CELLAR_NOT_FOUND: 'clever.cellar.not-found',
  INVALID_BUCKET_NAME: 'clever.cellar.invalid-bucket-name',
  BUCKET_ALREADY_EXISTS: 'clever.cellar.bucket-already-exists',
  TOO_MANY_BUCKETS: 'clever.cellar.too-many-buckets',
} as const;

export type CreateCellarBucketErrorCode =
  (typeof CREATE_CELLAR_BUCKET_ERROR_CODES)[keyof typeof CREATE_CELLAR_BUCKET_ERROR_CODES];

/**
 * Creates a bucket in a Cellar add-on.
 *
 * Common error codes: see {@link CREATE_CELLAR_BUCKET_ERROR_CODES}
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
