import { post } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, pickNonNull } from '../../../../lib/utils.js';
import { CcApiBridgeCommand } from '../../lib/cc-api-bridge-command.js';
import { transformCreatedApiToken } from './api-token-transform.js';
import type { CreateApiTokenCommandInput, CreateApiTokenCommandResponse } from './create-api-token-command.types.js';

/**
 * Mints a new API token for an account.
 *
 * The account credentials are passed in the body rather than taken from the client, and the token
 * value is only returned by this call, so it has to be stored right away.
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
        email: params.emailAddress,
        password: params.password,
        mfaCode: params.mfaCode,
        name: params.name,
        description: params.description,
        expirationDate: normalizeDate(params.expiresAt),
      }),
    );
  }

  transformCommandOutput(response: unknown): CreateApiTokenCommandResponse {
    return transformCreatedApiToken(response);
  }

  isAuthEnabled(): boolean {
    return false;
  }

  // each call runs a full OAuth dance and generates a new token id, so a replay mints a second token
  isIdempotent(): boolean {
    return false;
  }
}
