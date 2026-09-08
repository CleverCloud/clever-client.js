import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { GetCellarObjectCommandInput, GetCellarObjectCommandOutput } from './get-cellar-object-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `CELLAR_NOT_FOUND`: the add-on does not exist, or does not belong to the given owner
 * - `BUCKET_NOT_FOUND`: the bucket does not exist in the add-on
 * - `OBJECT_NOT_FOUND`: the object does not exist in the bucket
 */
export const GET_CELLAR_OBJECT_ERROR_CODES = {
  CELLAR_NOT_FOUND: 'clever.cellar.not-found',
  BUCKET_NOT_FOUND: 'clever.cellar.bucket-not-found',
  OBJECT_NOT_FOUND: 'clever.cellar.object-not-found',
} as const;

export type GetCellarObjectErrorCode =
  (typeof GET_CELLAR_OBJECT_ERROR_CODES)[keyof typeof GET_CELLAR_OBJECT_ERROR_CODES];

/**
 * Retrieves the metadata of one stored object: its tags, its access control list and its user
 * metadata. The object content itself is fetched through a download URL.
 *
 * Common error codes: see {@link GET_CELLAR_OBJECT_ERROR_CODES}
 *
 * @endpoint [GET] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX/objects/:XXX
 * @group Cellar
 * @version 4
 */
export class GetCellarObjectCommand extends CcApiSimpleCommand<
  GetCellarObjectCommandInput,
  GetCellarObjectCommandOutput
> {
  toRequestParams(params: GetCellarObjectCommandInput) {
    return get(
      safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/buckets/${params.bucketName}/objects/${params.objectKey}`,
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
