import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteCellarObjectCommandInput } from './delete-cellar-object-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `CELLAR_NOT_FOUND`: the add-on does not exist, or does not belong to the given owner
 * - `BUCKET_NOT_FOUND`: the bucket does not exist in the add-on
 * - `OBJECT_NOT_FOUND`: the object does not exist in the bucket
 */
export const DELETE_CELLAR_OBJECT_ERROR_CODES = {
  CELLAR_NOT_FOUND: 'clever.cellar.not-found',
  BUCKET_NOT_FOUND: 'clever.cellar.bucket-not-found',
  OBJECT_NOT_FOUND: 'clever.cellar.object-not-found',
} as const;

export type DeleteCellarObjectErrorCode =
  (typeof DELETE_CELLAR_OBJECT_ERROR_CODES)[keyof typeof DELETE_CELLAR_OBJECT_ERROR_CODES];

/**
 * Removes one object from a bucket.
 *
 * Common error codes: see {@link DELETE_CELLAR_OBJECT_ERROR_CODES}
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
