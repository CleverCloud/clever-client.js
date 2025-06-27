/**
 * @import { ConfirmAuthMfaCommandInput } from './confirm-auth-mfa-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
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
    return post(safeUrl`/v2/self/mfa/${params.kind}/confirmation`, omit(params, 'kind'));
  }
}
