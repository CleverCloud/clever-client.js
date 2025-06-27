/**
 * @import { CreateAuthMfaCommandInput, CreateAuthMfaCommandOutput } from './create-auth-mfa-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
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
    return post(safeUrl`/v2/self/mfa/${params.kind}`);
  }
}
