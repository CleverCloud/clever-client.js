import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { UpdateAuthPasswordCommandInput } from './update-auth-password-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `INVALID_PASSWORD`: the current password is wrong
 * - `INVALID_NEW_PASSWORD`: the new password is not between 12 and 4096 characters long
 */
export const UPDATE_AUTH_PASSWORD_ERROR_CODES = {
  INVALID_PASSWORD: 'clever.auth.invalid-password',
  INVALID_NEW_PASSWORD: 'clever.auth.invalid-new-password',
} as const;

export type UpdateAuthPasswordErrorCode =
  (typeof UPDATE_AUTH_PASSWORD_ERROR_CODES)[keyof typeof UPDATE_AUTH_PASSWORD_ERROR_CODES];

// `ValidationErrors.PASSWORD`, a 400 naming the fields at fault in `fields`
const PASSWORD_VALIDATION_ERROR_CODE = '504';

/**
 * Changes the password of the current user.
 *
 * The current password has to be given again, so that a stolen session cannot lock the owner out.
 * A wrong one is a 400, not a 401, so it never reads as an expired session.
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

  // both fields can be at fault at once, and the current password comes first: until it is right, the
  // new one is not worth fixing
  transformErrorCode({ code, body }: ApiErrorInfo) {
    if (code !== PASSWORD_VALIDATION_ERROR_CODE) {
      return code;
    }
    const fields = (body as { fields?: Record<string, string> } | undefined)?.fields ?? {};
    if (fields.oldPassword != null) {
      return UPDATE_AUTH_PASSWORD_ERROR_CODES.INVALID_PASSWORD;
    }
    if (fields.newPassword != null) {
      return UPDATE_AUTH_PASSWORD_ERROR_CODES.INVALID_NEW_PASSWORD;
    }
    return code;
  }

  // a replay sets the very same password, and is anyway rejected because the old password no longer matches
  isIdempotent(): boolean {
    return true;
  }
}
