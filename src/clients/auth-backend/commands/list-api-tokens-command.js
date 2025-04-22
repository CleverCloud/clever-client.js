import { get } from '../../../lib/request/request-params-builder.js';
import { AuthBackendCommand } from '../lib/auth-backend-command.js';

/**
 * @typedef {import('./list-api-tokens-command.types.js').ListApiTokensCommandOutput} ListApiTokensCommandOutput
 */

/**
 * @extends {AuthBackendCommand<void, ListApiTokensCommandOutput>}
 */
export class ListApiTokensCommand extends AuthBackendCommand {
  /** @type {AuthBackendCommand<void, ListApiTokensCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/api-tokens`);
  }

  /** @type {AuthBackendCommand<void, ListApiTokensCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      ...response,
      expirationDate: new Date(response.expirationDate),
      creationDate: new Date(response.creationDate),
    };
  }
}
