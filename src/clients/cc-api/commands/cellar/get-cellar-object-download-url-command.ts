import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetCellarObjectDownloadUrlCommandInput,
  GetCellarObjectDownloadUrlCommandOutput,
} from './get-cellar-object-download-url-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `CELLAR_NOT_FOUND`: the add-on does not exist, or does not belong to the given owner
 * - `BUCKET_NOT_FOUND`: the bucket does not exist in the add-on
 * - `OBJECT_NOT_FOUND`: the object does not exist in the bucket
 */
export const GET_CELLAR_OBJECT_DOWNLOAD_URL_ERROR_CODES = {
  CELLAR_NOT_FOUND: 'clever.cellar.not-found',
  BUCKET_NOT_FOUND: 'clever.cellar.bucket-not-found',
  OBJECT_NOT_FOUND: 'clever.cellar.object-not-found',
} as const;

export type GetCellarObjectDownloadUrlErrorCode =
  (typeof GET_CELLAR_OBJECT_DOWNLOAD_URL_ERROR_CODES)[keyof typeof GET_CELLAR_OBJECT_DOWNLOAD_URL_ERROR_CODES];

/**
 * Mints a presigned URL that downloads one object without credentials.
 *
 * Common error codes: see {@link GET_CELLAR_OBJECT_DOWNLOAD_URL_ERROR_CODES}
 *
 * @endpoint [POST] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX/objects/download-url
 * @group Cellar
 * @version 4
 */
export class GetCellarObjectDownloadUrlCommand extends CcApiSimpleCommand<
  GetCellarObjectDownloadUrlCommandInput,
  GetCellarObjectDownloadUrlCommandOutput
> {
  toRequestParams(params: GetCellarObjectDownloadUrlCommandInput) {
    return postJson(
      safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/buckets/${params.bucketName}/objects/download-url`,
      {
        objectKey: params.objectKey,
        expiresIn: params.expiresIn,
      },
    );
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  // the handler only signs an S3 URL, it stores nothing, so a replay mints a second URL for the same object
  isIdempotent(): boolean {
    return true;
  }
}
