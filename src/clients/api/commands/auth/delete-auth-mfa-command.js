/**
 * @import { DeleteAuthMfaCommandInput } from './delete-auth-mfa-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
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
    return delete_(safeUrl`/v2/self/mfa/${params.kind}`);
  }
}
