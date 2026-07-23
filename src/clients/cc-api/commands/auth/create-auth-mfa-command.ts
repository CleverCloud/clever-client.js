import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CreateAuthMfaCommandInput, CreateAuthMfaCommandOutput } from './create-auth-mfa-command.types.js';

/**
 * Starts enrolling the current user into a second authentication factor.
 *
 * The returned URL is the enrolment secret, meant to be shown as a QR code. The factor only becomes
 * active once a code produced from it is confirmed. The account password is sent base64-encoded in
 * the `X-Clever-Password` header.
 *
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
