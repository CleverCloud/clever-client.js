/**
 * @import { ConfirmAuthMfaCommandInput } from './confirm-auth-mfa-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ConfirmAuthMfaCommandInput, void>}
 * @endpoint [POST] /v2/self/mfa/:XXX/confirmation
 * @group Auth
 * @version 2
 */
export class ConfirmAuthMfaCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ConfirmAuthMfaCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
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
}
