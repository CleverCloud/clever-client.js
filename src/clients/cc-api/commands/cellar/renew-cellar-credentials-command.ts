import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  RenewCellarCredentialsCommandInput,
  RenewCellarCredentialsCommandOutput,
} from './renew-cellar-credentials-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `CELLAR_NOT_FOUND`: the add-on does not exist, or does not belong to the given owner
 */
export const RENEW_CELLAR_CREDENTIALS_ERROR_CODES = {
  CELLAR_NOT_FOUND: 'clever.cellar.not-found',
} as const;

export type RenewCellarCredentialsErrorCode =
  (typeof RENEW_CELLAR_CREDENTIALS_ERROR_CODES)[keyof typeof RENEW_CELLAR_CREDENTIALS_ERROR_CODES];

/**
 * Rotates the S3 credentials of a Cellar add-on.
 *
 * The previous key stops working, so every client using it has to be updated.
 *
 * Common error codes: see {@link RENEW_CELLAR_CREDENTIALS_ERROR_CODES}
 *
 * @endpoint [POST] /v4/cellar/organisations/:XXX/cellar/:XXX/credentials/renew
 * @group Cellar
 * @version 4
 */
export class RenewCellarCredentialsCommand extends CcApiSimpleCommand<
  RenewCellarCredentialsCommandInput,
  RenewCellarCredentialsCommandOutput
> {
  toRequestParams(params: RenewCellarCredentialsCommandInput) {
    return post(safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/credentials/renew`);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  // rotates the secret key on the storage cluster, so a replay invalidates the key the first call returned
  isIdempotent(): boolean {
    return false;
  }
}
