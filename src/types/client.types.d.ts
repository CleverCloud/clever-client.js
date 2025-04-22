import type { OnErrorHook, OnResponseHook, PrepareRequestParamsHook } from './hook.types.js';
import type { CcRequestConfig } from './request.types.js';

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
