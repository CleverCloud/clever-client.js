import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ConfirmAuthMfaCommandInput } from './confirm-auth-mfa-command.types.js';

/**
 * @endpoint [POST] /v2/self/mfa/:XXX/confirmation
 * @group Auth
 * @version 2
 */
export class ConfirmAuthMfaCommand extends CcApiSimpleCommand<ConfirmAuthMfaCommandInput, undefined> {
  toRequestParams(params: ConfirmAuthMfaCommandInput): Partial<CcRequestParams> {
    return {
      method: 'POST',
      url: safeUrl`/v2/self/mfa/${params.kind}/confirmation`,
      headers: new HeadersBuilder()
        .acceptJson()
        .contentTypeJson()
        .withHeader('X-Clever-Password', encodeToBase64(params.password))
        .build(),
      body: {
        code: params.code,
        revokeTokens: params.revokeTokens,
      },
    };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
