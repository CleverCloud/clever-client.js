/**
 * @import { UpdateAuthPasswordCommandInput } from './update-auth-password-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateAuthPasswordCommandInput, void>}
 * @endpoint [PUT] /v2/self/change_password
 * @group Auth
 * @version 2
 */
export class UpdateAuthPasswordCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateAuthPasswordCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/self/change_password`, {
      ...omit(params, 'revokeTokens'),
      dropTokens: params.revokeTokens,
    });
  }

  /** @type {CcApiSimpleCommand<UpdateAuthPasswordCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput(_response) {
    return null;
  }
}
