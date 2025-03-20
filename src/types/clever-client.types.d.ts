import type { OAuthTokens } from './auth.types.js';
import type { OnErrorHook, OnResponseHook, PrepareRequestParamsHook } from './hook.types.js';
import type { CcRequestConfig } from './request.types.js';
import type { Optionalize } from './utils.types.js';

export type CcClientConfig = {
  baseUrl: string;
  defaultRequestConfig?: Partial<CcRequestConfig>;
  hooks?: CcClientHooks;
};

export interface CcClientHooks {
  prepareRequestParams?: PrepareRequestParamsHook;
  onResponse?: OnResponseHook;
  onError?: OnErrorHook;
}

export type CcApiClientConfig = Optionalize<CcClientConfig, 'baseUrl'>;

export type CcApiClientConfigWithOAuth = CcApiClientConfig & {
  oAuthTokens: OAuthTokens;
};

export type CcApiClientConfigWithApiToken = CcApiClientConfig & {
  apiToken: string;
};

export type CcAuthBackendClientConfig = CcApiClientConfig & {
  oAuthTokens: OAuthTokens;
};

export type CcRedisHttpClientConfig = Optionalize<CcClientConfig, 'baseUrl'>;
