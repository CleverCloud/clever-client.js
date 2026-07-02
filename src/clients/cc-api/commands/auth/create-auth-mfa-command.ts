import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CreateAuthMfaCommandInput, CreateAuthMfaCommandOutput } from './create-auth-mfa-command.types.js';

/**
 * @endpoint [POST] /v2/self/mfa/:XXX
 * @group Auth
 * @version 2
 */
export class CreateAuthMfaCommand extends CcApiSimpleCommand<CreateAuthMfaCommandInput, CreateAuthMfaCommandOutput> {
  toRequestParams(params: CreateAuthMfaCommandInput): Partial<CcRequestParams> {
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
