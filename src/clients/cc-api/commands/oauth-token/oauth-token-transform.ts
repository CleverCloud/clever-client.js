import { normalizeDate } from '../../../../lib/utils.js';
import { transformOauthConsumer, transformOauthConsumerRights } from '../oauth-consumer/oauth-consumer-transform.js';
import type { OauthToken } from './list-oauth-token-command.types.js';

export function transformOauthToken(payload: any): OauthToken {
  return {
    token: payload.token,
    consumer: transformOauthConsumer(payload.consumer),
    createdAt: normalizeDate(payload.creationDate)!,
    expiresAt: normalizeDate(payload.expirationDate)!,
    lastUsedAt: normalizeDate(payload.lastUtilisation)!,
    rights: transformOauthConsumerRights(payload.rights),
    employeeId: payload.employeeId ?? undefined,
  };
}
