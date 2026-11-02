import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAuthMfa } from './auth-transform.js';
import type { GetAuthMfaCommandInput, GetAuthMfaCommandOutput } from './get-auth-mfa-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `ALMIGHTY_TOKEN_REQUIRED`: the client authenticates with a token not allowed to read the account
 *   security settings, such as an API token or a restricted OAuth consumer
 */
export const GET_AUTH_MFA_ERROR_CODES = {
  ALMIGHTY_TOKEN_REQUIRED: 'clever.auth.almighty-token-required',
} as const;

export type GetAuthMfaErrorCode = (typeof GET_AUTH_MFA_ERROR_CODES)[keyof typeof GET_AUTH_MFA_ERROR_CODES];

const API_ERROR_CODES: Record<string, GetAuthMfaErrorCode> = {
  // `USER_DATA_ACCESS`, a 403 for a token that is not almighty
  '7301': GET_AUTH_MFA_ERROR_CODES.ALMIGHTY_TOKEN_REQUIRED,
};

/**
 * Tells whether a second authentication factor is turned on for the current user, and how many of
 * its backup codes are left.
 *
 * Common error codes: see {@link GET_AUTH_MFA_ERROR_CODES}
 *
 * @endpoint [GET] /v2/self/mfa/:XXX
 * @group Auth
 * @version 2
 */
export class GetAuthMfaCommand extends CcApiSimpleCommand<GetAuthMfaCommandInput, GetAuthMfaCommandOutput> {
  toRequestParams(params: GetAuthMfaCommandInput) {
    return get(safeUrl`/v2/self/mfa/${params.kind}`);
  }

  transformCommandOutput(response: unknown): GetAuthMfaCommandOutput {
    return transformAuthMfa(response);
  }

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }

  isIdempotent(): boolean {
    return true;
  }
}
