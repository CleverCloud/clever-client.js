import { put } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import type { ApiErrorInfo } from '../../../../types/command.types.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { UpdateAuthPasswordCommandInput } from './update-auth-password-command.types.ts';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `INVALID_PASSWORD`: the current password is wrong
 * - `INVALID_NEW_PASSWORD`: the new password is not between 12 and 4096 characters long
 * - `PASSWORD_NOT_SET`: the account has no password yet, such as one signed up through an OAuth provider: its
 *   first password is set through {@link RequestAuthPasswordResetCommand}, not this command
 */
export const UPDATE_AUTH_PASSWORD_ERROR_CODES = {
  INVALID_PASSWORD: 'clever.auth.invalid-password',
  INVALID_NEW_PASSWORD: 'clever.auth.invalid-new-password',
  PASSWORD_NOT_SET: 'clever.auth.password-not-set',
} as const;

export type UpdateAuthPasswordErrorCode =
  (typeof UPDATE_AUTH_PASSWORD_ERROR_CODES)[keyof typeof UPDATE_AUTH_PASSWORD_ERROR_CODES];

const API_ERROR_CODES: Record<string, UpdateAuthPasswordErrorCode> = {
  // `USER_DATA_ACCESS`, a 403 for a wrong current password. The API answers the same to a token that is not
  // almighty, but only an almighty token can change the password: that one never gets here
  '7301': UPDATE_AUTH_PASSWORD_ERROR_CODES.INVALID_PASSWORD,
  // a 400 for a new password not between 12 and 4096 characters long
  '3002': UPDATE_AUTH_PASSWORD_ERROR_CODES.INVALID_NEW_PASSWORD,
  // `ValidationErrors.PASSWORD`, a 400 only sent to an account without a stored password, with `oldPassword` in
  // `fields`. The new password is checked before, so it never shows there
  '504': UPDATE_AUTH_PASSWORD_ERROR_CODES.PASSWORD_NOT_SET,
};

/**
 * Changes the password of the current user.
 *
 * The current password has to be given again, so that a stolen session cannot lock the owner out.
 * A wrong one is a 403, not a 401, so it never reads as an expired session.
 *
 * Common error codes: see {@link UPDATE_AUTH_PASSWORD_ERROR_CODES}
 *
 * @endpoint [PUT] /v2/self/change_password
 * @group Auth
 * @version 2
 */
export class UpdateAuthPasswordCommand extends CcApiSimpleCommand<UpdateAuthPasswordCommandInput, undefined> {
  toRequestParams(params: UpdateAuthPasswordCommandInput) {
    return put(safeUrl`/v2/self/change_password`, {
      oldPassword: params.oldPassword,
      newPassword: params.newPassword,
      dropTokens: params.shouldRevokeTokens,
    });
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }

  // a replay sets the very same password, and is anyway rejected because the old password no longer matches
  isIdempotent(): boolean {
    return true;
  }
}
