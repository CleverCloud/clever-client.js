/**
 * @import { CreateApiTokenCommandInput, CreateApiTokenCommandResponse } from './create-api-token-command.types.js'
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { AuthBackendCommand } from '../../lib/auth-backend-command.js';

/**
 * @extends {AuthBackendCommand<CreateApiTokenCommandInput, CreateApiTokenCommandResponse>}
 */
export class CreateApiTokenCommand extends AuthBackendCommand {
  isAuthRequired() {
    return false;
  }

  /** @type {AuthBackendCommand<CreateApiTokenCommandInput, CreateApiTokenCommandResponse>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/api-tokens`, params);
  }
}
