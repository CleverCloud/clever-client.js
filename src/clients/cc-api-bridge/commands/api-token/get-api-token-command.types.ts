import type { ApiToken } from './api-token.types.js';

export interface GetApiTokenCommandInput {
  apiTokenId: string;
}

export type GetApiTokenCommandOutput = ApiToken;
