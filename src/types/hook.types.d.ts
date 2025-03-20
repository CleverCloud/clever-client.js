import type { CcRequestParams, CcResponse } from './request.types.js';
import type { SelfOrPromise } from './utils.types.js';

export type PrepareRequestParamsHook = (request: Partial<CcRequestParams>) => SelfOrPromise<Partial<CcRequestParams>>;
export type OnResponseHook = <ResponseBody>(response: CcResponse<ResponseBody>) => SelfOrPromise<void>;
export type OnErrorHook = (error: any) => SelfOrPromise<void>;
