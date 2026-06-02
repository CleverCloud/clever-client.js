import { post } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, pickNonNull } from '../../../../lib/utils.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';
import type { CreateApiTokenCommandInput, CreateApiTokenCommandResponse } from './create-api-token-command.types.js';

/**
 * Create an API token
 *
 * @endpoint [POST] /api-tokens
 * @group ApiToken
 */
export class CreateApiTokenCommand extends CcApiBridgeCommand<
  CreateApiTokenCommandInput,
  CreateApiTokenCommandResponse
> {
  toRequestParams(params: CreateApiTokenCommandInput) {
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
