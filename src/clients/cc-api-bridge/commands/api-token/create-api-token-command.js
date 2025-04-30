/**
 * @import { CreateApiTokenCommandInput, CreateApiTokenCommandResponse } from './create-api-token-command.types.js'
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';

/**
 * @extends {CcApiBridgeCommand<CreateApiTokenCommandInput, CreateApiTokenCommandResponse>}
 */
export class CreateApiTokenCommand extends CcApiBridgeCommand {
  isAuthRequired() {
    return false;
  }

  /** @type {CcApiBridgeCommand<CreateApiTokenCommandInput, CreateApiTokenCommandResponse>['toRequestParams']} */
  toRequestParams(params) {
    return post(`/api-tokens`, params);
  }
}
