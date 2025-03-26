import type { OwnerIdIndexStore } from '../../api/common/owner-id-resolver.types.js';
import type { OAuthTokens } from './auth.types.js';
import type { OnErrorHook, OnResponseHook, PrepareRequestParamsHook } from './hook.types.js';
import type { CcRequestConfig } from './request.types.js';
import type { WithOptional } from './utils.types.js';

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

export type CcApiClientConfig = WithOptional<CcClientConfig, 'baseUrl'> & {
  ownerIdResolverStore?: OwnerIdIndexStore;
};

export type CcApiClientConfigWithOAuth = CcApiClientConfig & {
  oAuthTokens: OAuthTokens;
};

export type CcApiClientConfigWithApiToken = CcApiClientConfig & {
  apiToken: string;
};

export type CcAuthBackendClientConfig = CcApiClientConfig & {
  oAuthTokens: OAuthTokens;
};

export type CcRedisHttpClientConfig = WithOptional<CcClientConfig, 'baseUrl'>;
