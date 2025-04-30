/**
 * @import { CreateApiTokenCommandInput, CreateApiTokenCommandResponse } from './create-api-token-command.types.js'
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, pickNonNull } from '../../../../lib/utils.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';

/**
 * Create an API token
 *
 * @extends {CcApiBridgeCommand<CreateApiTokenCommandInput, CreateApiTokenCommandResponse>}
 * @endpoint [POST] /api-tokens
 * @group ApiToken
 */
export class CreateApiTokenCommand extends CcApiBridgeCommand {
  /** @type {CcApiBridgeCommand<CreateApiTokenCommandInput, CreateApiTokenCommandResponse>['toRequestParams']} */
  toRequestParams(params) {
    return post(
      `/api-tokens`,
      pickNonNull({
        email: params.email,
        password: params.password,
        mfaCode: params.mfaCode,
        name: params.name,
        description: params.description,
        expirationDate: normalizeDate(params.expirationDate),
      }),
    );
  }
}
