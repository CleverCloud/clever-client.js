import { normalizeDate } from '../../../../lib/utils.js';
import type { ApiToken } from './api-token.types.js';
import type { CreateApiTokenCommandResponse } from './create-api-token-command.types.js';

export function transformCreatedApiToken(payload: any): CreateApiTokenCommandResponse {
  return {
    apiToken: payload.apiToken,
    apiTokenId: payload.apiTokenId,
    createdAt: normalizeDate(payload.creationDate)!,
    expiresAt: normalizeDate(payload.expirationDate)!,
    name: payload.name,
    description: payload.description,
    state: payload.state,
  };
}

export function transformApiToken(payload: any): ApiToken {
  return {
    apiTokenId: payload.apiTokenId,
    userId: payload.userId,
    createdAt: normalizeDate(payload.creationDate)!,
    expiresAt: normalizeDate(payload.expirationDate)!,
    ip: payload.ip,
    name: payload.name,
    description: payload.description,
    state: payload.state,
  };
}
