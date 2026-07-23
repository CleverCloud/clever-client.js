import type { OauthToken } from './list-oauth-token-command.types.js';

/**
 * The OAuth token the current request was authenticated with.
 */
export type GetCurrentOauthTokenInfoCommandOutput = OauthToken;
