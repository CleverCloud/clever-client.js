import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { pickNonNull } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { RequestAuthPasswordResetCommandInput } from './request-auth-password-reset-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `EMAIL_FAILED`: the reset email could not be sent
 */
export const REQUEST_AUTH_PASSWORD_RESET_ERROR_CODES = {
  EMAIL_FAILED: 'clever.auth.password-reset-email-failed',
} as const;

export type RequestAuthPasswordResetErrorCode =
  (typeof REQUEST_AUTH_PASSWORD_RESET_ERROR_CODES)[keyof typeof REQUEST_AUTH_PASSWORD_RESET_ERROR_CODES];

const API_ERROR_CODES: Record<string, RequestAuthPasswordResetErrorCode> = {
  // `EMAIL_FAIL`, a 500
  '2401': REQUEST_AUTH_PASSWORD_RESET_ERROR_CODES.EMAIL_FAILED,
};

/**
 * Requests a password reset email for the given login. The endpoint consumes `application/x-www-form-urlencoded`
 * and responds with an HTML page, so the response body is discarded.
 *
 * Common error codes: see {@link REQUEST_AUTH_PASSWORD_RESET_ERROR_CODES}
 *
 * @endpoint [POST] /v2/password_forgotten
 * @group Auth
 * @version 2
 */
export class RequestAuthPasswordResetCommand extends CcApiSimpleCommand<
  RequestAuthPasswordResetCommandInput,
  undefined
> {
  toRequestParams(params: RequestAuthPasswordResetCommandInput): Partial<CcRequestParams> {
    const body = new URLSearchParams(
      pickNonNull({
        login: params.login,
        drop_tokens: params.shouldDropTokens ? 'true' : undefined,
        partner_id: params.partnerId,
      }),
    ).toString();

    return {
      method: 'POST',
      url: '/v2/password_forgotten',
      headers: new HeadersBuilder().acceptTextHtml().contentType('application/x-www-form-urlencoded').build(),
      body,
    };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }

  isAuthEnabled(): boolean {
    return false;
  }

  // every call mints a new reset key and mails it, and counts against the hourly per-mailbox limit
  isIdempotent(): boolean {
    return false;
  }
}
