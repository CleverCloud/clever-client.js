import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { UpdateAuthPasswordCommandInput } from './update-auth-password-command.types.js';

/**
 * @endpoint [PUT] /v2/self/change_password
 * @group Auth
 * @version 2
 */
export class UpdateAuthPasswordCommand extends CcApiSimpleCommand<UpdateAuthPasswordCommandInput, void> {
  toRequestParams(params: UpdateAuthPasswordCommandInput) {
    return put(safeUrl`/v2/self/change_password`, {
      oldPassword: params.oldPassword,
      newPassword: params.newPassword,
      dropTokens: params.revokeTokens,
    });
  }

  transformCommandOutput(): void {
    return null;
  }
}
