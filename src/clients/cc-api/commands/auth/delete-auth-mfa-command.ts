import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DeleteAuthMfaCommandInput } from './delete-auth-mfa-command.types.js';

/**
 * @endpoint [DELETE] /v2/self/mfa/:XXX
 * @group Auth
 * @version 2
 */
export class DeleteAuthMfaCommand extends CcApiSimpleCommand<DeleteAuthMfaCommandInput, undefined> {
  toRequestParams(params: DeleteAuthMfaCommandInput): Partial<CcRequestParams> {
    return {
      method: 'DELETE',
      url: safeUrl`/v2/self/mfa/${params.kind}`,
      headers: new HeadersBuilder()
        .acceptJson()
        .withHeader('X-Clever-Password', encodeToBase64(params.password))
        .build(),
    };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
