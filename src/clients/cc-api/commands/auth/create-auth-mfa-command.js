/**
 * @import { CreateAuthMfaCommandInput, CreateAuthMfaCommandOutput } from './create-auth-mfa-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateAuthMfaCommandInput, CreateAuthMfaCommandOutput>}
 * @endpoint [POST] /v2/self/mfa/:XXX
 * @group Auth
 * @version 2
 */
export class CreateAuthMfaCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateAuthMfaCommandInput, CreateAuthMfaCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return {
      method: 'POST',
      url: safeUrl`/v2/self/mfa/${params.kind}`,
      headers: new HeadersBuilder()
        .acceptJson()
        .withHeader('X-Clever-Password', encodeToBase64(params.password))
        .build(),
    };
  }
}
