import type { PrepareRequestParamsHook } from './hook.types.js';

export type CcAuth = false | PrepareRequestParamsHook;

export interface OAuthTokens {
  consumerKey: string;
  consumerSecret: string;
  token: string;
  secret: string;
}
