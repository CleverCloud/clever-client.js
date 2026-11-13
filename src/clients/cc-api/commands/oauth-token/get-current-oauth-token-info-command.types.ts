import type { OauthToken } from './list-oauth-token-command.types.ts';

/**
 * The OAuth token the current request was authenticated with.
 */
export type GetCurrentOauthTokenInfoCommandOutput = OauthToken;
