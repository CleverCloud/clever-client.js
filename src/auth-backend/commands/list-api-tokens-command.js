import { get } from '../../lib/request/request-params-builder.js';
import { AbstractAuthBackendCommand } from './abstract-auth-backend-command.js';

/**
 * @typedef {import('./list-api-tokens-command.types.js').ListApiTokensCommandResponse} ListApiTokensCommandResponse
 * @typedef {import('../../types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @extends {AbstractAuthBackendCommand<ListApiTokensCommandResponse>}
 */
export class ListApiTokensCommand extends AbstractAuthBackendCommand {
  /**
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams() {
    return get(`/api-tokens`);
  }

  /**
   * @param {any} response
   * @return {ListApiTokensCommandResponse}
   */
  convertResponseBody(response) {
    return {
      ...response,
      expirationDate: new Date(response.expirationDate),
      creationDate: new Date(response.creationDate),
    };
  }
}
