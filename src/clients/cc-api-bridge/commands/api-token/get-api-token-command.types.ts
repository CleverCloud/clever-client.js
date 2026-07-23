import type { ApiToken } from './api-token.types.js';

/**
 * Identifies the API token to retrieve.
 */
export interface GetApiTokenCommandInput {
  /** Identifier of the token. */
  apiTokenId: string;
}

/**
 * The requested token, without its value.
 */
export type GetApiTokenCommandOutput = ApiToken;
