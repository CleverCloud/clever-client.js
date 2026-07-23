import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { pickNonNull } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { RequestAuthPasswordResetCommandInput } from './request-auth-password-reset-command.types.js';

/**
 * Requests a password reset email for the given login. The endpoint consumes `application/x-www-form-urlencoded`
 * and responds with an HTML page, so the response body is discarded.
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

  isAuthEnabled(): boolean {
    return false;
  }
}
