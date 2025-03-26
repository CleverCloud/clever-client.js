import { post } from '../../common/lib/request/request-params-builder.js';
import { AbstractAuthBackendCommand } from './abstract-auth-backend-command.js';

/**
 * @typedef {import('./create-api-token-command.types.js').CreateApiTokenCommandInput} CreateApiTokenCommandInput
 * @typedef {import('./create-api-token-command.types.js').CreateApiTokenCommandResponse} CreateApiTokenCommandResponse
 * @typedef {import('../../common/types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @extends {AbstractAuthBackendCommand<CreateApiTokenCommandResponse>}
 */
export class CreateApiTokenCommand extends AbstractAuthBackendCommand {
  /**
   * @param {CreateApiTokenCommandInput} params
   */
  constructor(params) {
    super();
    this.params = params;
  }

  isAuthRequired() {
    return false;
  }

  /**
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams() {
    return post(`/api-tokens`, {
      ...this.params,
      expirationDate: this.params.expirationDate.toISOString(),
    });
  }

  /**
   * @param {any} response
   * @returns {CreateApiTokenCommandResponse} response
   */
  transformResponseBody(response) {
    return {
      ...response,
      expirationDate: new Date(response.expirationDate),
      creationDate: new Date(response.creationDate),
    };
  }
}
