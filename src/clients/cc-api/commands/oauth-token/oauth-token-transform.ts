import { normalizeDate } from '../../../../lib/utils.js';
import { transformOauthConsumer, transformOauthConsumerRights } from '../oauth-consumer/oauth-consumer-transform.js';
import type { OauthToken } from './list-oauth-token-command.types.js';

export function transformOauthToken(payload: any): OauthToken {
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
