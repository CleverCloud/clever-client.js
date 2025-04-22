import { post } from '../../../lib/request/request-params-builder.js';
import { AuthBackendCommand } from '../lib/auth-backend-command.js';

/**
 * @typedef {import('./create-api-token-command.types.js').CreateApiTokenCommandInput} CreateApiTokenCommandInput
 * @typedef {import('./create-api-token-command.types.js').CreateApiTokenCommandResponse} CreateApiTokenCommandResponse
 * @typedef {import('../../../types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @extends {AuthBackendCommand<CreateApiTokenCommandInput, CreateApiTokenCommandResponse>}
 */
export class CreateApiTokenCommand extends AuthBackendCommand {
  isAuthRequired() {
    return false;
  }

  /**
   * @param {CreateApiTokenCommandInput} params
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams(params) {
    return post(`/api-tokens`, {
      ...params,
      expirationDate: params.expirationDate.toISOString(),
    });
  }

  /**
   * @param {any} response
   * @returns {CreateApiTokenCommandResponse} response
   */
  transformCommandOutput(response) {
    return {
      ...response,
      expirationDate: new Date(response.expirationDate),
      creationDate: new Date(response.creationDate),
    };
  }
}
