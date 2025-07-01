/**
 * @import { DeleteAuthMfaCommandInput } from './delete-auth-mfa-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteAuthMfaCommandInput, void>}
 * @endpoint [DELETE] /v2/self/mfa/:XXX
 * @group Auth
 * @version 2
 */
export class DeleteAuthMfaCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteAuthMfaCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return {
      method: 'DELETE',
      url: safeUrl`/v2/self/mfa/${params.kind}`,
      headers: new HeadersBuilder()
        .acceptJson()
        .withHeader('X-Clever-Password', encodeToBase64(params.password))
        .build(),
    };
  }

  /** @type {CcApiSimpleCommand<DeleteAuthMfaCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
