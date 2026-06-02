/**
 * @import { ListTokenCommandOutput, OauthToken } from './list-oauth-token-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOauthConsumer, transformOauthConsumerRights } from '../oauth-consumer/oauth-consumer-transform.js';

/**
 * Lists Oauth tokens.
 *
 * This command is for internal use only.
 *
 * @extends {CcApiSimpleCommand<void, ListTokenCommandOutput>}
 * @endpoint [GET] /v2/self/tokens
 * @group Token
 * @version 2
 */
export class ListOauthTokenCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, ListTokenCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/v2/self/tokens`);
  }

  /** @type {CcApiSimpleCommand<void, ListTokenCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformOauthToken), { key: 'creationDate', order: 'desc' });
  }
}

/**
 * @param {any} payload
 * @returns {OauthToken}
 */
function transformOauthToken(payload) {
  return {
    token: payload.token,
    consumer: transformOauthConsumer(payload.consumer),
    creationDate: normalizeDate(payload.creationDate),
    expirationDate: normalizeDate(payload.expirationDate),
    lastUtilisationDate: normalizeDate(payload.lastUtilisation),
    rights: transformOauthConsumerRights(payload.rights),
    employeeId: payload.employeeId,
  };
}
